import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { BrokerCommissionsService } from './broker-commissions.service';

@Controller('brokers/:brokerId/commissions')
export class BrokerCommissionsController {
  constructor(private readonly commissionsService: BrokerCommissionsService) {}

  @Get()
  getPayments(@Param('brokerId') brokerId: string) {
    return this.commissionsService.getPaymentsByBroker(brokerId);
  }

  @Post()
  addPayment(@Param('brokerId') brokerId: string, @Body() data: { amount: number; date: string; notes?: string }) {
    return this.commissionsService.addPayment(brokerId, data);
  }
}
