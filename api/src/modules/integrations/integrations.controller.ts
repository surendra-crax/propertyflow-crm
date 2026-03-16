import { Controller, Get, Post, Body, Param, Put, UseGuards } from '@nestjs/common';
import { IntegrationsService } from './integrations.service';
import { IntegrationType } from '@prisma/client';
import { ThrottlerGuard } from '@nestjs/throttler';

@UseGuards(ThrottlerGuard)
@Controller('integrations')
export class IntegrationsController {
  constructor(private readonly integrationsService: IntegrationsService) {}

  @Get()
// @UseGuards(JwtAuthGuard)
  getAllIntegrations() {
    return this.integrationsService.getAllIntegrations();
  }

  @Get(':type')
// @UseGuards(JwtAuthGuard)
  getIntegrationByType(@Param('type') type: IntegrationType) {
    return this.integrationsService.getIntegrationByType(type);
  }

  @Put(':type')
// @UseGuards(JwtAuthGuard)
  upsertIntegration(
    @Param('type') type: IntegrationType,
    @Body() data: { isActive: boolean; credentials?: any; config?: any }
  ) {
    return this.integrationsService.upsertIntegration(type, data);
  }

  @Post('facebook-leads')
  handleFacebookWebhook(@Body() payload: any) {
    return this.integrationsService.handleFacebookPayload(payload);
  }

  @Post('99acres')
  handle99AcresWebhook(@Body() payload: any) {
    return this.integrationsService.handle99AcresPayload(payload);
  }

  @Post('magicbricks')
  handleMagicbricksWebhook(@Body() payload: any) {
    return this.integrationsService.handleMagicbricksPayload(payload);
  }

  @Post('housing')
  handleHousingWebhook(@Body() payload: any) {
    return this.integrationsService.handleHousingPayload(payload);
  }
}
