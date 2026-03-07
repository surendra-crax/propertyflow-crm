import { Controller, Get, UseGuards } from '@nestjs/common'
import { AnalyticsService } from './analytics.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { RolesGuard } from '../auth/roles.guard'
import { Roles } from '../auth/roles.decorator'

@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AnalyticsController {

  constructor(private analyticsService: AnalyticsService) { }

  @Roles('ADMIN', 'MANAGER')
  @Get('dashboard')
  getDashboardMetrics() {
    return this.analyticsService.getDashboardMetrics()
  }

  @Roles('ADMIN', 'MANAGER')
  @Get('lead-sources')
  leadSourceDistribution() {
    return this.analyticsService.leadSourceDistribution()
  }

  @Roles('ADMIN', 'MANAGER')
  @Get('agent-performance')
  agentPerformance() {
    return this.analyticsService.agentPerformance()
  }

  @Roles('ADMIN', 'MANAGER')
  @Get('funnel')
  getFunnel() {
    return this.analyticsService.getFunnelStats()
  }

  @Roles('ADMIN', 'MANAGER')
  @Get('agent-leaderboard')
  getAgentLeaderboard() {
    return this.analyticsService.getAgentLeaderboard()
  }

  @Roles('ADMIN', 'MANAGER')
  @Get('monthly-revenue')
  getMonthlyRevenue() {
    return this.analyticsService.getMonthlyRevenue()
  }

  @Roles('ADMIN', 'MANAGER')
  @Get('agent-conversion')
  getAgentConversion() {
    return this.analyticsService.agentConversionAnalytics()
  }

  @Roles('ADMIN', 'MANAGER')
  @Get('pipeline-forecast')
  getPipelineForecast() {
    return this.analyticsService.pipelineForecast()
  }

  @Roles('ADMIN', 'MANAGER', 'AGENT')
  @Get('today-followups')
  getTodayFollowups() {
    return this.analyticsService.todayFollowups()
  }

  @Roles('ADMIN', 'MANAGER', 'AGENT')
  @Get('overdue-followups')
  getOverdueFollowups() {
    return this.analyticsService.overdueFollowups()
  }

  @Roles('ADMIN', 'MANAGER')
  @Get('revenue-by-project')
  getRevenueByProject() {
    return this.analyticsService.revenueByProject()
  }

  @Roles('ADMIN', 'MANAGER')
  @Get('revenue-by-agent')
  getRevenueByAgent() {
    return this.analyticsService.revenueByAgent()
  }

  @Roles('ADMIN', 'MANAGER')
  @Get('revenue-by-source')
  getRevenueBySource() {
    return this.analyticsService.revenueBySource()
  }
}