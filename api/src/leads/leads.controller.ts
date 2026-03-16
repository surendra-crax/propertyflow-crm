import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Param,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common'

import { LeadsService } from './leads.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { RolesGuard } from '../auth/roles.guard'
import { Roles } from '../auth/roles.decorator'
import { CreateLeadDto } from './dto/create-lead.dto'
import { ThrottlerGuard } from '@nestjs/throttler'

@Controller('leads')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LeadsController {

  constructor(private leadsService: LeadsService) { }

  @Roles('ADMIN', 'MANAGER', 'AGENT')
  @Post()
  create(@Body() body: CreateLeadDto, @Req() req: any) {
    return this.leadsService.createLead(body, req.user.sub)
  }

  @UseGuards(ThrottlerGuard)
  @Roles('ADMIN', 'MANAGER', 'AGENT')
  @Post('check-duplicate')
  checkDuplicate(@Body() body: { phone?: string; email?: string }) {
    return this.leadsService.checkDuplicate(body.phone, body.email)
  }

  @Roles('ADMIN', 'MANAGER')
  @Post('merge')
  mergeLeads(@Body() body: { keepId: string; removeId: string }, @Req() req: any) {
    return this.leadsService.mergeLeads(body.keepId, body.removeId)
  }

  @Roles('ADMIN', 'MANAGER', 'AGENT')
  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
    @Query('search') search?: string
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 50;
    return this.leadsService.getAllLeads(pageNum, limitNum, status, search);
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