import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async getPaymentsByDeal(dealId: string) {
    return this.prisma.payment.findMany({ where: { dealId } });
  }

  async addPayment(dealId: string, data: any) {
    return this.prisma.payment.create({
      data: { ...data, dealId }
    });
  }
}
