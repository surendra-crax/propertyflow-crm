import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateLeadDto } from './dto/create-lead.dto'
import { LeadStatus, LeadSource, PropertyType, LeadTemperature } from '@prisma/client'
import { AuditLogService } from '../modules/audit-log/audit-log.service'

@Injectable()
export class LeadsService {
  constructor(
    private prisma: PrismaService,
    private auditLog: AuditLogService
  ) { }

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

    // Audit log
    await this.auditLog.log({
      userId,
      action: 'LEAD_CREATED',
      entityType: 'LEAD',
      entityId: lead.id,
      newValue: { fullName: lead.fullName, status: lead.status }
    })

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
          },
          activities: {
              orderBy: { createdAt: 'desc' },
              take: 5
          }
        },
        orderBy: { updatedAt: 'desc' }
      }),
      this.prisma.lead.count({ where })
    ]);

    return { data, total, page, limit };
  }

  async getLeadById(id: string) {
    return this.prisma.lead.findUnique({
      where: { id },
      include: {
        project: true,
        assignedAgent: {
          select: { id: true, name: true, email: true, role: true }
        },
        activities: {
          include: { user: { select: { name: true } } },
          orderBy: { createdAt: 'desc' }
        },
        visits: {
          include: { agent: { select: { name: true } } },
          orderBy: { visitDate: 'desc' }
        },
        deal: {
          include: { project: true }
        }
      }
    });
  }

  async updateLead(id: string, data: any, userId?: string) {
    const oldLead = await this.prisma.lead.findUnique({ where: { id } });
    
    const lead = await this.prisma.lead.update({
      where: { id },
      data,
      include: {
        project: true,
        assignedAgent: {
          select: { id: true, name: true, email: true, role: true }
        }
      }
    });

    if (userId && data.status && data.status !== oldLead?.status) {
      await this.prisma.activity.create({
        data: {
          leadId: id,
          userId,
          type: 'STATUS_UPDATED',
          description: `Lead status updated from ${oldLead?.status} to ${data.status}`,
        }
      });

      // Audit log
      await this.auditLog.log({
        userId,
        action: 'LEAD_STATUS_UPDATED',
        entityType: 'LEAD',
        entityId: id,
        oldValue: { status: oldLead?.status },
        newValue: { status: data.status }
      });
    }

    return lead;
  }
}