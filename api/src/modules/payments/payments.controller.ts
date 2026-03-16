import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('deals/:dealId/payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  getPaymentsByDeal(@Param('dealId') dealId: string) {
    return this.paymentsService.getPaymentsByDeal(dealId);
  }

  @Post()
  addPayment(@Param('dealId') dealId: string, @Body() data: any) {
    return this.paymentsService.addPayment(dealId, data);
  }
}
