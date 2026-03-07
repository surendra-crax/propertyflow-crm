import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateLeadDto } from './dto/create-lead.dto'
import { LeadStatus, LeadSource, PropertyType } from '@prisma/client'

@Injectable()
export class LeadsService {
  constructor(private prisma: PrismaService) { }

  async createLead(data: CreateLeadDto, userId?: string) {
    const lead = await this.prisma.lead.create({
      data: {
        fullName: data.fullName,
        phone: data.phone,
        email: data.email,
        budgetMin: data.budgetMin,
        budgetMax: data.budgetMax,
        propertyType: data.propertyType as PropertyType,
        status: (data.status || 'NEW') as LeadStatus,
        source: data.source as LeadSource,
        notes: data.notes,
        projectId: data.projectId,
        assignedAgentId: data.assignedAgentId,
        nextFollowup: data.nextFollowup ? new Date(data.nextFollowup) : null,
      },
      include: {
        project: true,
        assignedAgent: {
          select: { id: true, name: true, email: true, role: true }
        }
      }
    })

    // Log activity
    if (userId) {
      const agentName = lead.assignedAgent?.name || 'an agent'
      await this.prisma.activity.create({
        data: {
          leadId: lead.id,
          userId,
          type: 'LEAD_CREATED',
          description: `Lead "${lead.fullName}" created and assigned to ${agentName}`,
        }
      })
    }

    return lead
  }

  async getAllLeads() {
    return this.prisma.lead.findMany({
      include: {
        project: true,
        assignedAgent: {
          select: { id: true, name: true, email: true, role: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
  }

  async getLeadById(id: string) {
    return this.prisma.lead.findUnique({
      where: { id },
      include: {
        project: true,
        assignedAgent: {
          select: { id: true, name: true, email: true, role: true }
        },
        visits: {
          include: {
            agent: {
              select: { id: true, name: true }
            }
          },
          orderBy: { visitDate: 'desc' }
        },
        activities: {
          include: {
            user: {
              select: { id: true, name: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        deal: {
          include: {
            project: true,
            broker: true,
          }
        }
      }
    })
  }

  async updateLeadStatus(id: string, status: any, userId?: string) {
    const lead = await this.prisma.lead.update({
      where: { id },
      data: { status },
      include: {
        assignedAgent: { select: { name: true } }
      }
    })

    // Log activity
    if (userId) {
      await this.prisma.activity.create({
        data: {
          leadId: id,
          userId,
          type: 'STATUS_CHANGE',
          description: `Lead status changed to ${status}`,
        }
      })
    }

    return lead
  }

  async updateLead(id: string, data: any) {
    return this.prisma.lead.update({
      where: { id },
      data
    })
  }

  async getPipeline() {
    const leads = await this.prisma.lead.findMany({
      include: {
        project: true,
        assignedAgent: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    const pipeline: Record<string, any[]> = {
      NEW: [],
      CONTACTED: [],
      FOLLOW_UP: [],
      SITE_VISIT_DONE: [],
      NEGOTIATION: [],
      CLOSED_WON: [],
      CLOSED_LOST: []
    }

    for (const lead of leads) {
      pipeline[lead.status].push(lead)
    }

    return pipeline
  }

  async updateFollowup(id: string, date: string) {
    return this.prisma.lead.update({
      where: { id },
      data: { nextFollowup: new Date(date) }
    })
  }

  async getTodayFollowups() {
    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date()
    endOfDay.setHours(23, 59, 59, 999)

    return this.prisma.lead.findMany({
      where: {
        nextFollowup: {
          gte: startOfDay,
          lte: endOfDay
        }
      },
      include: {
        project: true,
        assignedAgent: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { nextFollowup: 'asc' }
    })
  }

  async getOverdueFollowups() {
    const now = new Date()
    now.setHours(0, 0, 0, 0)

    return this.prisma.lead.findMany({
      where: {
        nextFollowup: { lt: now },
        status: { notIn: ['CLOSED_WON', 'CLOSED_LOST'] }
      },
      include: {
        project: true,
        assignedAgent: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { nextFollowup: 'asc' }
    })
  }
}