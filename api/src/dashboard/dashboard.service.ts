import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class DashboardService {

  constructor(private prisma: PrismaService) {}

  async getStats() {
    const [totalLeads, dealsClosed, revenueResult] = await Promise.all([
      this.prisma.lead.count(),
      this.prisma.deal.count(),
      this.prisma.deal.aggregate({
        _sum: { saleValue: true }
      })
    ])

    const totalRevenue = revenueResult._sum.saleValue || 0

    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date()
    endOfDay.setHours(23, 59, 59, 999)

    const followupsToday = await this.prisma.lead.count({
      where: {
        nextFollowup: {
          gte: startOfDay,
          lte: endOfDay
        }
      }
    })

    return {
      totalLeads,
      dealsClosed,
      totalRevenue,
      followupsToday
    }
  }

}