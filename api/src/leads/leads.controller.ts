import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common'

import { LeadsService } from './leads.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { RolesGuard } from '../auth/roles.guard'
import { Roles } from '../auth/roles.decorator'
import { CreateLeadDto } from './dto/create-lead.dto'

@Controller('leads')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LeadsController {

  constructor(private leadsService: LeadsService) { }

  @Roles('ADMIN', 'MANAGER', 'AGENT')
  @Post()
  create(@Body() body: CreateLeadDto, @Req() req: any) {
    return this.leadsService.createLead(body, req.user.sub)
  }

  @Roles('ADMIN', 'MANAGER', 'AGENT')
  @Get()
  findAll() {
    return this.leadsService.getAllLeads()
  }

  @Roles('ADMIN', 'MANAGER', 'AGENT')
  @Get('pipeline')
  getPipeline() {
    return this.leadsService.getPipeline()
  }

  @Roles('ADMIN', 'MANAGER', 'AGENT')
  @Get('followups/today')
  getTodayFollowups() {
    return this.leadsService.getTodayFollowups()
  }

  @Roles('ADMIN', 'MANAGER', 'AGENT')
  @Get('followups/overdue')
  getOverdueFollowups() {
    return this.leadsService.getOverdueFollowups()
  }

  @Roles('ADMIN', 'MANAGER', 'AGENT')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.leadsService.getLeadById(id)
  }

  @Roles('ADMIN', 'MANAGER', 'AGENT')
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string },
    @Req() req: any,
  ) {
    return this.leadsService.updateLeadStatus(id, body.status, req.user.sub)
  }

  @Roles('ADMIN', 'MANAGER', 'AGENT')
  @Patch(':id/followup')
  updateFollowup(
    @Param('id') id: string,
    @Body() body: { date: string }
  ) {
    return this.leadsService.updateFollowup(id, body.date)
  }

  @Roles('ADMIN', 'MANAGER', 'AGENT')
  @Patch(':id')
  updateLead(
    @Param('id') id: string,
    @Body() body: any
  ) {
    return this.leadsService.updateLead(id, body)
  }
}