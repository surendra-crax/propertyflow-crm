import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common'
import { DealsService } from './deals.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { RolesGuard } from '../auth/roles.guard'
import { Roles } from '../auth/roles.decorator'

@Controller('deals')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DealsController {

  constructor(private dealsService: DealsService) { }

  @Roles('ADMIN', 'MANAGER', 'AGENT')
  @Post()
  create(@Body() body: any, @Req() req: any) {
    return this.dealsService.createDeal(body, req.user.sub)
  }

  @Roles('ADMIN', 'MANAGER', 'AGENT', 'BROKER')
  @Get()
  findAll() {
    return this.dealsService.getDeals()
  }
}