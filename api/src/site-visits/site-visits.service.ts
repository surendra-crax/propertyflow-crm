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

  async updateStatus(id: string, status: VisitStatus) {

    return this.prisma.siteVisit.update({
      where: { id },
      data: { status }
    })

  }

}