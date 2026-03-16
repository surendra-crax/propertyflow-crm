import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  Query,
  UseGuards
} from '@nestjs/common'

import { SiteVisitsService } from './site-visits.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { RolesGuard } from '../auth/roles.guard'
import { Roles } from '../auth/roles.decorator'
import { VisitStatus } from '@prisma/client'

@Controller('site-visits')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SiteVisitsController {

  constructor(private siteVisitsService: SiteVisitsService) { }

  @Roles('ADMIN', 'MANAGER', 'AGENT')
  @Post()
  create(@Body() body: {
    leadId: string
    agentId: string
    visitDate: string
    status: VisitStatus
    notes?: string
  }) {
    return this.siteVisitsService.createVisit({
      ...body,
      visitDate: new Date(body.visitDate)
    })
  }

  @Roles('ADMIN', 'MANAGER', 'AGENT')
  @Get()
  findAll() {
    return this.siteVisitsService.getVisits()
  }

  @Roles('ADMIN', 'MANAGER', 'AGENT')
  @Get('calendar')
  getCalendar(
    @Query('start') start: string,
    @Query('end') end: string,
    @Query('agentId') agentId?: string
  ) {
    if (!start || !end) {
      throw new Error('start and end dates are required');
    }
    return this.siteVisitsService.getCalendarVisits(new Date(start), new Date(end), agentId);
  }

  @Roles('ADMIN', 'MANAGER', 'AGENT')
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() body: { status: VisitStatus }
  ) {
    return this.siteVisitsService.updateStatus(id, body.status)
  }
}