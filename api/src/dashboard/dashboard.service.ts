import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class DashboardService {

  constructor(private prisma: PrismaService) {}

  async getStats() {

    const totalLeads = await this.prisma.lead.count()

    const dealsClosed = await this.prisma.deal.count()

    const deals = await this.prisma.deal.findMany()

    const totalRevenue = deals.reduce(
      (sum, deal) => sum + deal.saleValue,
      0
    )

    const startOfDay = new Date()
    startOfDay.setHours(0,0,0,0)

    const endOfDay = new Date()
    endOfDay.setHours(23,59,59,999)

    const followupsToday = await this.prisma.lead.count({
      where:{
        nextFollowup:{
          gte:startOfDay,
          lte:endOfDay
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