import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class BrokersService {
  constructor(private prisma: PrismaService) {}

  async createBroker(data: any) {
    return this.prisma.broker.create({
      data
    })
  }

  async getBrokers() {
    return this.prisma.broker.findMany({
      include: {
        deals: true
      }
    })
  }

  async getBrokerPerformance(id: string) {
    const deals = await this.prisma.deal.findMany({
      where: { brokerId: id }
    })

    const totalRevenue = deals.reduce((sum, d) => sum + d.saleValue, 0)
    const totalCommission = deals.reduce((sum, d) => sum + d.commissionAmount, 0)

    return {
      dealsClosed: deals.length,
      totalRevenue,
      totalCommission
    }
  }
}