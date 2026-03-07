import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req
} from '@nestjs/common'

import { ProjectsService } from './projects.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { RolesGuard } from '../auth/roles.guard'
import { Roles } from '../auth/roles.decorator'

@Controller('projects')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjectsController {

  constructor(private projectsService: ProjectsService) { }

  @Roles('ADMIN', 'MANAGER')
  @Post()
  create(@Req() req: any, @Body() body: any) {
    const managerId = req.user.sub
    return this.projectsService.create({
      ...body,
      managerId
    })
  }

  @Roles('ADMIN', 'MANAGER')
  @Get('analytics')
  getAnalytics() {
    return this.projectsService.getProjectAnalytics()
  }

  @Roles('ADMIN', 'MANAGER', 'BROKER')
  @Get()
  findAll() {
    return this.projectsService.findAll()
  }
}