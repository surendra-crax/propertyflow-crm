import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardMetrics() {
    // Sequential queries to stay within the free-tier connection pool
    const totalLeads    = await this.prisma.lead.count();
    const totalDeals    = await this.prisma.deal.count();
    const activeProjects = await this.prisma.project.count();
    const revenueResult = await this.prisma.deal.aggregate({ _sum: { saleValue: true } });
    const revenue       = revenueResult._sum.saleValue || 0;
    const conversionRate = totalLeads === 0 ? 0 : Math.round((totalDeals / totalLeads) * 100);
    const activeSiteVisits = await this.prisma.siteVisit.count({ where: { status: 'SCHEDULED' } });

    return { totalLeads, totalDeals, revenue, conversionRate, activeSiteVisits, activeProjects };
  }

  async getSourceConversions() {
    const leads = await this.prisma.lead.groupBy({
      by: ['source'],
      _count: { id: true },
    });
    return leads.map(l => ({ source: l.source, count: l._count.id }));
  }

  async agentPerformance() {
    const agents = await this.prisma.user.findMany({
      where: { role: 'AGENT' },
      include: { leads: { include: { deal: true } }, visits: true },
    });

    return agents.map(agent => {
      const deals = agent.leads.filter(l => l.deal !== null);
      const revenue = deals.reduce((sum, l) => sum + (l.deal?.saleValue || 0), 0);
      const conversionRate = agent.leads.length === 0
        ? 0
        : Math.round((deals.length / agent.leads.length) * 100);

      return { id: agent.id, name: agent.name, leads: agent.leads.length, visits: agent.visits.length, deals: deals.length, revenue, conversionRate };
    });
  }

  // Single groupBy instead of 7 parallel count() calls
  async getFunnelStats() {
    const result = await this.prisma.lead.groupBy({
      by: ['status'],
      _count: { id: true },
    });
    const stages = ['NEW', 'CONTACTED', 'FOLLOW_UP', 'SITE_VISIT_DONE', 'NEGOTIATION', 'CLOSED_WON', 'CLOSED_LOST'];
    const map = Object.fromEntries(result.map(r => [r.status, r._count.id]));
    return stages.map(stage => ({ stage, count: map[stage] || 0 }));
  }

  // Single query + client-side bucketing instead of 3–5 parallel count() calls per agent
  async getAgentLeaderboard(month?: string) {
    let gteDate: Date | undefined;
    let ltDate: Date | undefined;
    if (month && month !== 'ALL') {
      const m   = parseInt(month, 10);
      const year = new Date().getFullYear();
      gteDate = new Date(year, m - 1, 1);
      ltDate  = new Date(year, m, 1);
    }

    const agents = await this.prisma.user.findMany({
      where: { role: 'AGENT' },
      select: {
        id: true,
        name: true,
        _count: { select: { leads: true, visits: true } },
        leads: { select: { deal: { select: { saleValue: true, closedAt: true } } } },
      },
    });

    const leaderboard = agents.map(agent => {
      const filtered = agent.leads
        .filter(l => l.deal !== null)
        .filter(l => {
          if (!gteDate) return true;
          const closedAt = new Date(l.deal!.closedAt);
          return closedAt >= gteDate && closedAt < ltDate!;
        });

      return {
        id:      agent.id,
        name:    agent.name,
        leads:   agent._count.leads,
        deals:   filtered.length,
        visits:  agent._count.visits,
        revenue: filtered.reduce((s, l) => s + (l.deal?.saleValue || 0), 0),
      };
    });

    return leaderboard.sort((a, b) => b.revenue - a.revenue);
  }

  async getMonthlyRevenue() {
    const year  = new Date().getFullYear();
    const deals = await this.prisma.deal.findMany({
      where: { closedAt: { gte: new Date(year, 0, 1) } },
      select: { saleValue: true, closedAt: true },
    });

    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const map: Record<string, number> = Object.fromEntries(months.map(m => [m, 0]));

    deals.forEach(d => {
      const m = months[new Date(d.closedAt).getMonth()];
      map[m] += d.saleValue;
    });

    return months.map(month => ({ month, revenue: map[month] }));
  }

  async pipelineForecast() {
    const result = await this.prisma.lead.groupBy({
      by: ['status'],
      where: { status: { in: ['FOLLOW_UP', 'SITE_VISIT_DONE', 'NEGOTIATION'] } },
      _sum: { budgetMin: true, budgetMax: true },
    });

    const map: Record<string, number> = { FOLLOW_UP: 0, SITE_VISIT_DONE: 0, NEGOTIATION: 0 };
    result.forEach(r => { map[r.status] = ((r._sum.budgetMin || 0) + (r._sum.budgetMax || 0)) / 2; });

    return [
      { stage: 'Follow Up',   value: map.FOLLOW_UP       },
      { stage: 'Site Visit',  value: map.SITE_VISIT_DONE  },
      { stage: 'Negotiation', value: map.NEGOTIATION      },
    ];
  }

  async revenueByProject() {
    const projects = await this.prisma.project.findMany({
      include: { deals: { select: { saleValue: true } } },
    });

    return projects.map(p => ({
      project: p.name,
      revenue: p.deals.reduce((s, d) => s + d.saleValue, 0),
      deals:   p.deals.length,
    })).sort((a, b) => b.revenue - a.revenue);
  }

  // Single findMany + client bucketing instead of 5 parallel count() calls
  async getLeadAgingReport() {
    const now   = new Date();
    const leads = await this.prisma.lead.findMany({
      where:  { status: { notIn: ['CLOSED_WON', 'CLOSED_LOST'] } },
      select: { updatedAt: true },
    });

    const buckets = [
      { label: '0–3 days',   minDays: 0,  maxDays: 3,    count: 0, urgent: false },
      { label: '4–7 days',   minDays: 4,  maxDays: 7,    count: 0, urgent: false },
      { label: '8–15 days',  minDays: 8,  maxDays: 15,   count: 0, urgent: false },
      { label: '16–30 days', minDays: 16, maxDays: 30,   count: 0, urgent: true  },
      { label: '30+ days',   minDays: 31, maxDays: 9999,  count: 0, urgent: true  },
    ];

    leads.forEach(lead => {
      const days = Math.floor((now.getTime() - new Date(lead.updatedAt).getTime()) / 86400000);
      for (const b of buckets) {
        if (days >= b.minDays && days <= b.maxDays) { b.count++; break; }
      }
    });

    return buckets.map(({ label, count, urgent }) => ({ label, count, urgent }));
  }

  async getResponseTimeMetrics() {
    const leads = await this.prisma.lead.findMany({
      include: { activities: { orderBy: { createdAt: 'asc' }, take: 1 } },
    });

    const now = new Date().getTime();
    let totalResponseTimeMs = 0;
    let contactedCount = 0;
    let notContacted15Min = 0;
    let notContacted1Hour = 0;

    leads.forEach(lead => {
      const createdMs = new Date(lead.createdAt).getTime();
      if (lead.activities.length > 0) {
        const firstContactMs = new Date(lead.activities[0].createdAt).getTime();
        const rt = firstContactMs - createdMs;
        if (rt >= 0) {
          totalResponseTimeMs += rt;
          contactedCount++;
          if (rt > 15 * 60000) notContacted15Min++;
          if (rt > 60 * 60000) notContacted1Hour++;
        }
      } else {
        const age = now - createdMs;
        if (age > 15 * 60000) notContacted15Min++;
        if (age > 60 * 60000) notContacted1Hour++;
      }
    });

    return {
      avgResponseTimeMinutes: contactedCount > 0 ? Math.round(totalResponseTimeMs / contactedCount / 60000) : 0,
      notContacted15Min,
      notContacted1Hour,
      totalLeads: leads.length,
    };
  }

  async getLeadLeakageReport() {
    const leads = await this.prisma.lead.findMany({
      where:   { status: { notIn: ['CLOSED_WON', 'CLOSED_LOST'] } },
      include: { activities: { orderBy: { createdAt: 'desc' }, take: 1 } },
    });

    const now          = new Date().getTime();
    const sevenDaysMs  = 7 * 24 * 3600000;
    const threeDaysMs  = 3 * 24 * 3600000;
    let notContacted = 0;
    let noFollowUp   = 0;
    const stuckByStage: Record<string, number> = {};

    leads.forEach(lead => {
      if (lead.activities.length === 0) {
        notContacted++;
      } else if (now - new Date(lead.activities[0].createdAt).getTime() > threeDaysMs) {
        noFollowUp++;
      }
      if (now - new Date(lead.updatedAt).getTime() > sevenDaysMs) {
        stuckByStage[lead.status] = (stuckByStage[lead.status] || 0) + 1;
      }
    });

    return { notContacted, noFollowUp, stuckByStage, totalActiveLeads: leads.length };
  }

  async getSalesVelocity() {
    const wonLeads = await this.prisma.lead.findMany({
      where:  { status: 'CLOSED_WON' },
      select: { createdAt: true, updatedAt: true },
    });

    const totalWonTimeMs = wonLeads.reduce((s, l) =>
      s + (new Date(l.updatedAt).getTime() - new Date(l.createdAt).getTime()), 0);
    const avgLeadToBookingDays = wonLeads.length > 0
      ? Math.round(totalWonTimeMs / wonLeads.length / 86400000) : 0;

    const activeLeads = await this.prisma.lead.findMany({
      where:  { status: { notIn: ['CLOSED_WON', 'CLOSED_LOST'] } },
      select: { status: true, updatedAt: true },
    });

    const now = new Date().getTime();
    const stageTimes: Record<string, { totalMs: number; count: number }> = {};

    activeLeads.forEach(lead => {
      if (!stageTimes[lead.status]) stageTimes[lead.status] = { totalMs: 0, count: 0 };
      stageTimes[lead.status].totalMs += now - new Date(lead.updatedAt).getTime();
      stageTimes[lead.status].count++;
    });

    const stages = ['NEW', 'CONTACTED', 'FOLLOW_UP', 'SITE_VISIT_DONE', 'NEGOTIATION'];
    const avgDaysPerStage = stages.map(stage => {
      const d = stageTimes[stage];
      return { stage, avgDays: d && d.count > 0 ? Math.max(1, Math.round(d.totalMs / d.count / 86400000)) : 1 };
    });

    return { avgLeadToBookingDays, totalWonLeads: wonLeads.length, avgDaysPerStage };
  }
}
