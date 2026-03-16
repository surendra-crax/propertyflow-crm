import { Controller, Get, Post, Body, Param, Put, UseGuards } from '@nestjs/common';
import { UnitsService } from './units.service';

@Controller('projects/:projectId/units')
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  @Get()
  getUnitsByProject(@Param('projectId') projectId: string) {
    return this.unitsService.getUnitsByProject(projectId);
  }

  @Post()
  createUnit(@Param('projectId') projectId: string, @Body() data: any) {
    return this.unitsService.createUnit(projectId, data);
  }

  @Put(':id')
  updateUnit(@Param('id') id: string, @Body() data: any) {
    return this.unitsService.updateUnit(id, data);
  }
}
