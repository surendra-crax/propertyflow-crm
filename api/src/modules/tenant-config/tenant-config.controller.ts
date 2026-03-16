import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { TenantConfigService } from './tenant-config.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard'; // assuming this exists, wait I'll check it shortly

@Controller('tenant-config')
export class TenantConfigController {
  constructor(private readonly configService: TenantConfigService) {}

  @Get()
  getConfig() {
    return this.configService.getConfig();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  updateConfig(@Body() data: any) {
    return this.configService.updateConfig(data);
  }
}
