import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { AutomationsService } from './automations.service';

@Controller('automations')
export class AutomationsController {
  constructor(private readonly automationsService: AutomationsService) {}

  @Get()
  getRules() {
    return this.automationsService.getRules();
  }

  @Post()
  createRule(@Body() data: any) {
    return this.automationsService.createRule(data);
  }

  @Put(':id/toggle')
  toggleRule(@Param('id') id: string, @Body('isActive') isActive: boolean) {
    return this.automationsService.toggleRule(id, isActive);
  }
}
