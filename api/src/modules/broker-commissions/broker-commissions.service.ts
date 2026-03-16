import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BrokerCommissionsService {
  constructor(private prisma: PrismaService) {}

  async getPaymentsByBroker(brokerId: string) {
    return this.prisma.commissionPayment.findMany({ where: { brokerId } });
  }

  async addPayment(brokerId: string, data: { amount: number; date: string; notes?: string }) {
    return this.prisma.commissionPayment.create({
      data: {
        brokerId,
        amount: data.amount,
        date: new Date(data.date),
        notes: data.notes
      }
    });
  }
}
