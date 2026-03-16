import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { CampaignsService } from './campaigns.service';

@Controller('campaigns')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Roles('ADMIN', 'MANAGER')
  @Get()
  getAll() { return this.campaignsService.getAll(); }

  @Roles('ADMIN', 'MANAGER')
  @Get('roi')
  getROI() { return this.campaignsService.getROI(); }

  @Roles('ADMIN', 'MANAGER')
  @Post()
  create(@Body() body: any) { return this.campaignsService.create(body); }

  @Roles('ADMIN', 'MANAGER')
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) { return this.campaignsService.update(id, body); }

  @Roles('ADMIN')
  @Delete(':id')
  delete(@Param('id') id: string) { return this.campaignsService.delete(id); }
}
