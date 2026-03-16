import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  getDashboardMetrics() {
    return this.analyticsService.getDashboardMetrics();
  }

  @Get('monthly-revenue')
  getMonthlyRevenue() {
    return this.analyticsService.getMonthlyRevenue();
  }

  @Get('lead-sources')
  getSourceConversions() {
    return this.analyticsService.getSourceConversions();
  }

  @Get('pipeline-forecast')
  pipelineForecast() {
    return this.analyticsService.pipelineForecast();
  }

  @Get('agent-leaderboard')
  getAgentLeaderboard(@Query('month') month?: string) {
    return this.analyticsService.getAgentLeaderboard(month);
  }

  @Get('lead-aging')
  getLeadAging() {
    return this.analyticsService.getLeadAgingReport();
  }

  @Get('response-time')
  getResponseTime() {
    return this.analyticsService.getResponseTimeMetrics();
  }

  @Get('lead-leakage')
  getLeadLeakage() {
    return this.analyticsService.getLeadLeakageReport();
  }

  @Get('sales-velocity')
  getSalesVelocity() {
    return this.analyticsService.getSalesVelocity();
  }
}
