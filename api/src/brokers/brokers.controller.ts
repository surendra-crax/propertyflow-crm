import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards
} from '@nestjs/common'

import { BrokersService } from './brokers.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { RolesGuard } from '../auth/roles.guard'
import { Roles } from '../auth/roles.decorator'

@Controller('brokers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BrokersController {

  constructor(private brokersService: BrokersService) { }

  @Roles('ADMIN')
  @Post()
  create(@Body() body: any) {
    return this.brokersService.createBroker(body)
  }

  @Roles('ADMIN', 'MANAGER', 'AGENT')
  @Get()
  findAll() {
    return this.brokersService.getBrokers()
  }

  @Roles('ADMIN')
  @Get(':id/performance')
  getPerformance(@Param('id') id: string) {
    return this.brokersService.getBrokerPerformance(id)
  }
}