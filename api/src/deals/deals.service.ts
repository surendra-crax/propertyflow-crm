import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class DealsService {

  constructor(private prisma: PrismaService) { }

  async createDeal(data: {
    leadId: string
    projectId: string
    saleValue: number
    brokerId?: string
    notes?: string
  }, userId?: string) {

    let commissionAmount = 0

    if (data.brokerId) {
      const broker = await this.prisma.broker.findUnique({
        where: { id: data.brokerId }
      })
      if (broker) {
        commissionAmount = (data.saleValue * broker.commission) / 100
      }
    }

    const deal = await this.prisma.deal.create({
      data: {
        leadId: data.leadId,
        projectId: data.projectId,
        saleValue: data.saleValue,
        brokerId: data.brokerId,
        commissionAmount,
        notes: data.notes,
        closedAt: new Date()
      },
      include: {
        lead: true,
        project: true,
        broker: true,
      }
    })

    // Update lead status to CLOSED_WON
    await this.prisma.lead.update({
      where: { id: data.leadId },
      data: { status: 'CLOSED_WON' }
    })

    // Log activity
    if (userId) {
      await this.prisma.activity.create({
        data: {
          leadId: data.leadId,
          userId,
          type: 'DEAL_CREATED',
          description: `Deal closed for ₹${data.saleValue.toLocaleString()} on project ${deal.project.name}`,
        }
      })
    }

    return deal
  }

  async getDeals() {
    return this.prisma.deal.findMany({
      include: {
        lead: {
          include: {
            assignedAgent: {
              select: { id: true, name: true }
            }
          }
        },
        project: true,
        broker: true
      },
      orderBy: { createdAt: 'desc' }
    })
  }
}