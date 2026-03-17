import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardMetrics() {
    const totalLeads = await this.prisma.lead.count();
    const totalDeals = await this.prisma.deal.count();
    const activeProjects = await this.prisma.project.count();

    const revenueResult = await this.prisma.deal.aggregate({
      _sum: { saleValue: true }
    });

    const revenue = revenueResult._sum.saleValue || 0;

    const conversionRate =
      totalLeads === 0
        ? 0
        : Math.round((totalDeals / totalLeads) * 100);

    const activeSiteVisits = await this.prisma.siteVisit.count({
      where: { status: 'SCHEDULED' }
    });

    return {
      totalLeads,
      totalDeals,
      revenue,
      conversionRate,
      activeSiteVisits,
      activeProjects,
    };
  }

  async getSourceConversions() {
    const leads = await this.prisma.lead.groupBy({
      by: ['source'],
      _count: {
        id: true,
      },
    });

    return leads.map(l => ({
      source: l.source,
      count: l._count.id
    }));
  }

  async agentPerformance() {
    const agents = await this.prisma.user.findMany({
      where: { role: 'AGENT' },
      include: {
        leads: {
          include: { deal: true }
        },
        visits: true
      }
    });

    return agents.map(agent => {
      const deals = agent.leads.filter(l => l.deal !== null);
      const revenue = deals.reduce((sum, l) => sum + (l.deal?.saleValue || 0), 0);
      const conversionRate = agent.leads.length === 0
        ? 0
        : Math.round((deals.length / agent.leads.length) * 100);

      return {
        id: agent.id,
        name: agent.name,
        leads: agent.leads.length,
        visits: agent.visits.length,
        deals: deals.length,
        revenue,
        conversionRate,
      };
    });
  }

  async getFunnelStats() {
    const stages = [
      'NEW', 'CONTACTED', 'FOLLOW_UP',
      'SITE_VISIT_DONE', 'NEGOTIATION',
      'CLOSED_WON', 'CLOSED_LOST'
    ];

    const counts = await Promise.all(
      stages.map(async (stage) => ({
        stage,
        count: await this.prisma.lead.count({
          where: { status: stage as any }
        })
      }))
    );

    return counts;
  }

  async getAgentLeaderboard(month?: string) {
    const where: any = {};
    if (month && month !== 'ALL') {
      const m = parseInt(month, 10);
      const year = new Date().getFullYear();
      where.closedAt = {
        gte: new Date(year, m - 1, 1),
        lt: new Date(year, m, 1),
      };
    }

    const agents = await this.prisma.user.findMany({
      where: { role: 'AGENT' },
      select: { id: true, name: true }
    });

    const leaderboard = await Promise.all(agents.map(async (agent) => {
      const [leadsCount, deals, visitsCount] = await Promise.all([
        this.prisma.lead.count({ where: { assignedAgentId: agent.id } }),
        this.prisma.deal.findMany({
          where: { 
            lead: { assignedAgentId: agent.id },
            ...where
          },
          select: { saleValue: true }
        }),
        this.prisma.siteVisit.count({ where: { agentId: agent.id } })
      ]);

      return {
        id: agent.id,
        name: agent.name,
        leads: leadsCount,
        deals: deals.length,
        visits: visitsCount,
        revenue: deals.reduce((sum, d) => sum + d.saleValue, 0)
      };
    }));

    leaderboard.sort((a, b) => b.revenue - a.revenue);

    return leaderboard;
  }

  async getMonthlyRevenue() {
    const year = new Date().getFullYear();
    const deals = await this.prisma.deal.findMany({
      where: {
        closedAt: {
          gte: new Date(year, 0, 1)
        }
      },
      select: { saleValue: true, closedAt: true }
    });

    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const revenueMap: Record<string, number> = {};
    months.forEach(m => { revenueMap[m] = 0; });

    deals.forEach(deal => {
      const date = new Date(deal.closedAt);
      const month = months[date.getMonth()];
      revenueMap[month] += deal.saleValue;
    });

    return months.map(month => ({
      month,
      revenue: revenueMap[month]
    }));
  }

  async pipelineForecast() {
    const result = await this.prisma.lead.groupBy({
      by: ['status'],
      where: {
        status: {
          in: ['FOLLOW_UP', 'SITE_VISIT_DONE', 'NEGOTIATION']
        }
      },
      _sum: {
        budgetMin: true,
        budgetMax: true
      }
    });

    const stagesMap: Record<string, number> = {
      FOLLOW_UP: 0,
      SITE_VISIT_DONE: 0,
      NEGOTIATION: 0
    };

    result.forEach(r => {
      stagesMap[r.status] = ((r._sum.budgetMin || 0) + (r._sum.budgetMax || 0)) / 2;
    });

    return [
      { stage: 'Follow Up', value: stagesMap.FOLLOW_UP },
      { stage: 'Site Visit', value: stagesMap.SITE_VISIT_DONE },
      { stage: 'Negotiation', value: stagesMap.NEGOTIATION },
    ];
  }

  async revenueByProject() {
    const projects = await this.prisma.project.findMany({
      include: {
        deals: { select: { saleValue: true } }
      }
    });

    return projects.map(p => ({
      project: p.name,
      revenue: p.deals.reduce((sum, d) => sum + d.saleValue, 0),
      deals: p.deals.length
    })).sort((a, b) => b.revenue - a.revenue);
  }

  async getLeadAgingReport() {
    const now = new Date();

    const buckets = [
      { label: '0–3 days', minDays: 0, maxDays: 3 },
      { label: '4–7 days', minDays: 4, maxDays: 7 },
      { label: '8–15 days', minDays: 8, maxDays: 15 },
      { label: '16–30 days', minDays: 16, maxDays: 30 },
      { label: '30+ days', minDays: 31, maxDays: 9999 },
    ];

    const results = await Promise.all(
      buckets.map(async (bucket) => {
        const from = new Date(now);
        from.setDate(from.getDate() - bucket.maxDays);

        const to = new Date(now);
        to.setDate(to.getDate() - bucket.minDays);

        const count = await this.prisma.lead.count({
          where: {
            updatedAt: { gte: from, lte: to },
            status: { notIn: ['CLOSED_WON', 'CLOSED_LOST'] },
          },
        });

        return { label: bucket.label, count, urgent: bucket.minDays >= 16 };
      })
    );

    return results;
  }

  async getResponseTimeMetrics() {
    // Fetch leads and their first activity
    const leads = await this.prisma.lead.findMany({
      include: {
        activities: {
          orderBy: { createdAt: 'asc' },
          take: 1
        }
      }
    });

    const now = new Date().getTime();
    let totalResponseTimeMs = 0;
    let contactedCount = 0;
    
    let notContacted15Min = 0;
    let notContacted1Hour = 0;

    leads.forEach(lead => {
      const createdMs = new Date(lead.createdAt).getTime();

      if (lead.activities.length > 0) {
        // Has been contacted
        const firstContactMs = new Date(lead.activities[0].createdAt).getTime();
        const responseTimeMs = firstContactMs - createdMs;
        
        // Ensure valid positive time
        if (responseTimeMs >= 0) {
            totalResponseTimeMs += responseTimeMs;
            contactedCount++;

            if (responseTimeMs > 15 * 60 * 1000) notContacted15Min++;
            if (responseTimeMs > 60 * 60 * 1000) notContacted1Hour++;
        }
      } else {
        // Not contacted yet, check if time has passed
        const ageMs = now - createdMs;
        if (ageMs > 15 * 60 * 1000) notContacted15Min++;
        if (ageMs > 60 * 60 * 1000) notContacted1Hour++;
      }
    });

    const avgResponseTimeMs = contactedCount > 0 ? totalResponseTimeMs / contactedCount : 0;
    const avgResponseTimeMinutes = Math.round(avgResponseTimeMs / 60000);

    return {
      avgResponseTimeMinutes,
      notContacted15Min,
      notContacted1Hour,
      totalLeads: leads.length
    };
  }

  async getLeadLeakageReport() {
    const leads = await this.prisma.lead.findMany({
      where: {
        status: { notIn: ['CLOSED_WON', 'CLOSED_LOST'] }
      },
      include: {
        activities: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });

    const now = new Date().getTime();
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    const threeDaysMs = 3 * 24 * 60 * 60 * 1000;

    let notContacted = 0;
    let noFollowUp = 0;
    const stuckByStage: Record<string, number> = {};

    leads.forEach(lead => {
      // Not Contacted
      if (lead.activities.length === 0) {
        notContacted++;
      } else {
        // Contacted but no recent activity (no Follow-up)
        const lastActivityMs = new Date(lead.activities[0].createdAt).getTime();
        if (now - lastActivityMs > threeDaysMs) {
          noFollowUp++;
        }
      }

      // Stuck in stage > 7 days
      const updatedMs = new Date(lead.updatedAt).getTime();
      if (now - updatedMs > sevenDaysMs) {
        stuckByStage[lead.status] = (stuckByStage[lead.status] || 0) + 1;
      }
    });

    return {
      notContacted,
      noFollowUp,
      stuckByStage,
      totalActiveLeads: leads.length
    };
  }

  async getSalesVelocity() {
    // 1. Avg Lead to Booking Time (Total Velocity)
    const wonLeads = await this.prisma.lead.findMany({
      where: { status: 'CLOSED_WON' },
      select: { createdAt: true, updatedAt: true }
    });

    let totalWonTimeMs = 0;
    wonLeads.forEach(lead => {
      totalWonTimeMs += (new Date(lead.updatedAt).getTime() - new Date(lead.createdAt).getTime());
    });

    const avgLeadToBookingDays = wonLeads.length > 0 
      ? Math.round(totalWonTimeMs / wonLeads.length / (1000 * 60 * 60 * 24)) 
      : 0;

    // 2. Avg Days Per Stage (proxy: how long active leads have spent in their current stage)
    const activeLeads = await this.prisma.lead.findMany({
      where: {
        status: { notIn: ['CLOSED_WON', 'CLOSED_LOST'] }
      },
      select: { status: true, updatedAt: true }
    });

    const now = new Date().getTime();
    const stageTimes: Record<string, { totalMs: number, count: number }> = {};

    activeLeads.forEach(lead => {
      if (!stageTimes[lead.status]) {
        stageTimes[lead.status] = { totalMs: 0, count: 0 };
      }
      const timeInStage = now - new Date(lead.updatedAt).getTime();
      stageTimes[lead.status].totalMs += timeInStage;
      stageTimes[lead.status].count += 1;
    });

    const stages = [
      'NEW', 'CONTACTED', 'FOLLOW_UP', 'SITE_VISIT_DONE', 'NEGOTIATION'
    ];

    const avgDaysPerStage = stages.map(stage => {
      const data = stageTimes[stage];
      let avgDays = 0;
      if (data && data.count > 0) {
        avgDays = Math.round(data.totalMs / data.count / (1000 * 60 * 60 * 24));
      }
      return {
        stage,
        avgDays: Math.max(1, avgDays) // Show at least 1 for visual purposes if active
      };
    });

    return {
      avgLeadToBookingDays,
      totalWonLeads: wonLeads.length,
      avgDaysPerStage
    };
  }
}

