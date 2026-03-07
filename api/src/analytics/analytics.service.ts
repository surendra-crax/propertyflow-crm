import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class AnalyticsService {

  constructor(private prisma: PrismaService) { }

  async getDashboardMetrics() {
    const totalLeads = await this.prisma.lead.count()
    const totalDeals = await this.prisma.deal.count()

    const revenueResult = await this.prisma.deal.aggregate({
      _sum: { saleValue: true }
    })

    const revenue = revenueResult._sum.saleValue || 0

    const conversionRate =
      totalLeads === 0
        ? 0
        : Math.round((totalDeals / totalLeads) * 100)

    const activeSiteVisits = await this.prisma.siteVisit.count({
      where: { status: 'SCHEDULED' }
    })

    return {
      totalLeads,
      totalDeals,
      revenue,
      conversionRate,
      activeSiteVisits,
    }
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
    })

    return agents.map(agent => {
      const deals = agent.leads.filter(l => l.deal !== null)
      const revenue = deals.reduce((sum, l) => sum + (l.deal?.saleValue || 0), 0)
      const conversionRate = agent.leads.length === 0
        ? 0
        : Math.round((deals.length / agent.leads.length) * 100)

      return {
        id: agent.id,
        name: agent.name,
        leads: agent.leads.length,
        visits: agent.visits.length,
        deals: deals.length,
        revenue,
        conversionRate,
      }
    })
  }

  async getFunnelStats() {
    const stages = [
      'NEW', 'CONTACTED', 'FOLLOW_UP',
      'SITE_VISIT_DONE', 'NEGOTIATION',
      'CLOSED_WON', 'CLOSED_LOST'
    ]

    const counts = await Promise.all(
      stages.map(async (stage) => ({
        stage,
        count: await this.prisma.lead.count({
          where: { status: stage as any }
        })
      }))
    )

    return counts
  }

  async getAgentLeaderboard() {
    const agents = await this.prisma.user.findMany({
      where: { role: 'AGENT' },
      include: {
        leads: {
          include: { deal: true }
        },
        visits: true
      }
    })

    const leaderboard = agents.map(agent => {
      const agentDeals = agent.leads.filter(l => l.deal !== null)
      const revenue = agentDeals.reduce(
        (sum, l) => sum + (l.deal?.saleValue || 0), 0
      )

      return {
        id: agent.id,
        name: agent.name,
        leads: agent.leads.length,
        visits: agent.visits.length,
        deals: agentDeals.length,
        revenue
      }
    })

    leaderboard.sort((a, b) => b.revenue - a.revenue)

    return leaderboard
  }

  async getMonthlyRevenue() {
    const deals = await this.prisma.deal.findMany({
      select: { saleValue: true, closedAt: true }
    })

    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ]

    const revenueMap: Record<string, number> = {}
    months.forEach(m => { revenueMap[m] = 0 })

    deals.forEach(deal => {
      const date = new Date(deal.closedAt)
      const month = months[date.getMonth()]
      revenueMap[month] += deal.saleValue
    })

    return months.map(month => ({
      month,
      revenue: revenueMap[month]
    }))
  }

  async leadSourceDistribution() {
    const leads = await this.prisma.lead.findMany({
      select: { source: true }
    })

    const map: Record<string, number> = {}

    leads.forEach(lead => {
      const source = lead.source || 'Unknown'
      if (!map[source]) map[source] = 0
      map[source]++
    })

    return Object.keys(map).map(source => ({
      source,
      count: map[source]
    }))
  }

  async agentConversionAnalytics() {
    const agents = await this.prisma.user.findMany({
      where: { role: 'AGENT' },
      include: {
        leads: {
          include: { deal: true }
        }
      }
    })

    return agents.map(agent => {
      const leads = agent.leads.length
      const deals = agent.leads.filter(l => l.deal !== null).length
      const revenue = agent.leads.reduce(
        (sum, l) => sum + (l.deal?.saleValue || 0), 0
      )
      const conversionRate =
        leads === 0 ? 0 : Math.round((deals / leads) * 100)

      return {
        agent: agent.name,
        leads,
        deals,
        revenue,
        conversionRate
      }
    })
  }

  async pipelineForecast() {
    const leads = await this.prisma.lead.findMany({
      where: {
        status: {
          in: ['FOLLOW_UP', 'SITE_VISIT_DONE', 'NEGOTIATION']
        }
      }
    })

    const stages: Record<string, number> = {
      FOLLOW_UP: 0,
      SITE_VISIT_DONE: 0,
      NEGOTIATION: 0
    }

    leads.forEach(lead => {
      const avgValue = (lead.budgetMin + lead.budgetMax) / 2
      stages[lead.status] += avgValue
    })

    return [
      { stage: 'Follow Up', value: stages.FOLLOW_UP },
      { stage: 'Site Visit', value: stages.SITE_VISIT_DONE },
      { stage: 'Negotiation', value: stages.NEGOTIATION },
    ]
  }

  async todayFollowups() {
    const start = new Date()
    start.setHours(0, 0, 0, 0)

    const end = new Date()
    end.setHours(23, 59, 59, 999)

    const leads = await this.prisma.lead.findMany({
      where: {
        nextFollowup: { gte: start, lte: end }
      },
      include: {
        assignedAgent: { select: { id: true, name: true } },
        project: { select: { name: true } }
      },
      orderBy: { nextFollowup: 'asc' }
    })

    return leads.map(lead => ({
      id: lead.id,
      name: lead.fullName,
      phone: lead.phone,
      project: lead.project?.name,
      agent: lead.assignedAgent?.name,
      time: lead.nextFollowup
    }))
  }

  async overdueFollowups() {
    const now = new Date()
    now.setHours(0, 0, 0, 0)

    const leads = await this.prisma.lead.findMany({
      where: {
        nextFollowup: { lt: now },
        status: { notIn: ['CLOSED_WON', 'CLOSED_LOST'] }
      },
      include: {
        assignedAgent: { select: { id: true, name: true } },
        project: { select: { name: true } }
      },
      orderBy: { nextFollowup: 'asc' }
    })

    return leads.map(lead => ({
      id: lead.id,
      name: lead.fullName,
      phone: lead.phone,
      project: lead.project?.name,
      agent: lead.assignedAgent?.name,
      time: lead.nextFollowup
    }))
  }

  async revenueByProject() {
    const projects = await this.prisma.project.findMany({
      include: {
        deals: { select: { saleValue: true } }
      }
    })

    return projects.map(p => ({
      project: p.name,
      revenue: p.deals.reduce((sum, d) => sum + d.saleValue, 0),
      deals: p.deals.length
    })).sort((a, b) => b.revenue - a.revenue)
  }

  async revenueByAgent() {
    const agents = await this.prisma.user.findMany({
      where: { role: 'AGENT' },
      include: {
        leads: {
          include: { deal: { select: { saleValue: true } } }
        }
      }
    })

    return agents.map(a => ({
      agent: a.name,
      revenue: a.leads.reduce(
        (sum, l) => sum + (l.deal?.saleValue || 0), 0
      ),
      deals: a.leads.filter(l => l.deal !== null).length
    })).sort((a, b) => b.revenue - a.revenue)
  }

  async revenueBySource() {
    const leads = await this.prisma.lead.findMany({
      include: {
        deal: { select: { saleValue: true } }
      }
    })

    const map: Record<string, { revenue: number; deals: number }> = {}

    leads.forEach(l => {
      const source = l.source || 'Unknown'
      if (!map[source]) map[source] = { revenue: 0, deals: 0 }
      if (l.deal) {
        map[source].revenue += l.deal.saleValue
        map[source].deals++
      }
    })

    return Object.keys(map).map(source => ({
      source,
      revenue: map[source].revenue,
      deals: map[source].deals
    })).sort((a, b) => b.revenue - a.revenue)
  }
}