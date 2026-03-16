import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { VisitStatus } from '@prisma/client'

@Injectable()
export class SiteVisitsService {

  constructor(private prisma: PrismaService) {}

  async createVisit(data: {
    leadId: string
    agentId: string
    visitDate: Date
    status: VisitStatus
    notes?: string
  }) {

    return this.prisma.siteVisit.create({
      data,
      include: {
        lead: true,
        agent: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

  }

  async getVisits() {

    return this.prisma.siteVisit.findMany({
      include: {
        lead: true,
        agent: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        visitDate: "desc"
      }
    })

  }

  async getCalendarVisits(startDate: Date, endDate: Date, agentId?: string) {
    const where: any = {
      visitDate: {
        gte: startDate,
        lte: endDate
      }
    };
    if (agentId) where.agentId = agentId;

    return this.prisma.siteVisit.findMany({
      where,
      include: {
        lead: true,
        agent: { select: { name: true } }
      },
      orderBy: { visitDate: "asc" }
    })
  }

  async updateStatus(id: string, status: VisitStatus) {

    return this.prisma.siteVisit.update({
      where: { id },
      data: { status }
    })

  }

}