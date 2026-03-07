import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards
} from '@nestjs/common'

import { ActivitiesService } from './activities.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { RolesGuard } from '../auth/roles.guard'
import { Roles } from '../auth/roles.decorator'

@Controller('activities')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ActivitiesController {

  constructor(private activitiesService: ActivitiesService) { }

  @Roles('ADMIN', 'MANAGER', 'AGENT')
  @Post()
  create(@Body() body: any) {
    return this.activitiesService.createActivity(body)
  }

  @Roles('ADMIN', 'MANAGER', 'AGENT')
  @Get(':leadId')
  getLeadActivities(@Param('leadId') leadId: string) {
    return this.activitiesService.getLeadActivities(leadId)
  }
}