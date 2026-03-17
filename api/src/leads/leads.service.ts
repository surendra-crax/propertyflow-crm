import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateLeadDto } from './dto/create-lead.dto'
import { LeadStatus, LeadSource, PropertyType, LeadTemperature } from '@prisma/client'

@Injectable()
export class LeadsService {
  constructor(private prisma: PrismaService) { }

  private calculateLeadScore(lead: any): { score: number, temperature: LeadTemperature } {
    let score = 0;

    // Budget Scoring
    const avgBudget = (lead.budgetMin + lead.budgetMax) / 2;
    if (avgBudget > 5000000) score += 20;
    else if (avgBudget > 2000000) score += 10;
    else score += 5;

    // Source Scoring
    const highQualitySources = ['WEBSITE', 'REFERRAL', 'BROKER'];
    if (highQualitySources.includes(lead.source)) score += 15;
    else score += 5;

    // Status / Engagement Scoring
    if (lead.status === 'SITE_VISIT_DONE') score += 30;
    if (lead.status === 'NEGOTIATION') score += 40;
    if (lead.status === 'CONTACTED') score += 10;
    if (lead.status === 'FOLLOW_UP') score += 15;

    let temperature: LeadTemperature = 'COLD';
    if (score >= 60) temperature = 'HOT';
    else if (score >= 30) temperature = 'WARM';

    return { score, temperature };
  }

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
      }
    })

    const { score, temperature } = this.calculateLeadScore(lead);

    const leadWithScore = await this.prisma.lead.update({
      where: { id: lead.id },
      data: { score, temperature },
      include: {
        project: true,
        assignedAgent: {
          select: { id: true, name: true, email: true, role: true }
        }
      }
    })

    // Log activity
    if (userId) {
      const agentName = (leadWithScore as any).assignedAgent?.name || 'an agent'
      await this.prisma.activity.create({
        data: {
          leadId: lead.id,
          userId,
          type: 'LEAD_CREATED',
          description: `Lead "${lead.fullName}" created and assigned to ${agentName}`,
        }
      })
    }

    return leadWithScore
  }

  async getAllLeads(page: number = 1, limit: number = 50, status?: string, search?: string) {
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status && status !== 'ALL') where.status = status;
    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.lead.findMany({
        where,
        skip,
        take: limit,
        include: {
          project: true,
          assignedAgent: {
            select: { id: true, name: true, email: true, role: true }
          }
        },
        orderBy: [
          { score: 'desc' },
          { createdAt: 'desc' }
        ]
      }),
      this.prisma.lead.count({ where })
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
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
    const currentLead = await this.prisma.lead.findUnique({ where: { id }});
    const { score, temperature } = this.calculateLeadScore({ ...currentLead, status });

    const lead = await this.prisma.lead.update({
      where: { id },
      data: { status, score, temperature },
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
    const currentLead = await this.prisma.lead.findUnique({ where: { id }});
    const { score, temperature } = this.calculateLeadScore({ ...currentLead, ...data });

    return this.prisma.lead.update({
      where: { id },
      data: { ...data, score, temperature }
    })
  }

  async getPipeline() {
    const leads = await this.prisma.lead.findMany({
      select: {
        id: true,
        fullName: true,
        phone: true,
        status: true,
        budgetMin: true,
        budgetMax: true,
        temperature: true,
        score: true,
        project: {
          select: { name: true }
        },
        assignedAgent: {
          select: { name: true }
        }
      },
      orderBy: { updatedAt: 'desc' },
      take: 1000 // Limit for performance safety
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

    leads.forEach(lead => {
      if (pipeline[lead.status]) {
        pipeline[lead.status].push(lead)
      }
    })

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

  async checkDuplicate(phone?: string, email?: string) {
    if (!phone && !email) return { duplicate: false }

    const conditions: any[] = []
    if (phone) conditions.push({ phone })
    if (email) conditions.push({ email })

    const existing = await this.prisma.lead.findFirst({
      where: { OR: conditions },
      include: {
        project: { select: { name: true } },
        assignedAgent: { select: { name: true } },
      }
    })

    if (existing) return { duplicate: true, existing }
    return { duplicate: false }
  }

  async mergeLeads(keepId: string, removeId: string) {
    // Move activities
    await this.prisma.activity.updateMany({
      where: { leadId: removeId },
      data: { leadId: keepId }
    })

    // Move visits
    await this.prisma.siteVisit.updateMany({
      where: { leadId: removeId },
      data: { leadId: keepId }
    })

    // Add a merge activity
    await this.prisma.activity.create({
      data: {
        leadId: keepId,
        userId: keepId, // placeholder - ideally pass userId
        type: 'MERGED',
        description: `Lead merged from duplicate record ${removeId}`,
      }
    })

    // Delete the duplicate
    await this.prisma.lead.delete({ where: { id: removeId } })

    return this.getLeadById(keepId)
  }
}