import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IntegrationType } from '@prisma/client';
import { LeadsService } from '../../leads/leads.service';

@Injectable()
export class IntegrationsService {
  constructor(
    private prisma: PrismaService,
    private leadsService: LeadsService
  ) {}

  async getAllIntegrations() {
    return this.prisma.integration.findMany();
  }

  async getIntegrationByType(type: IntegrationType) {
    const integration = await this.prisma.integration.findFirst({ where: { type } });
    if (!integration) {
      throw new NotFoundException(`Integration of type ${type} not found`);
    }
    return integration;
  }

  async upsertIntegration(type: IntegrationType, data: { isActive: boolean; credentials?: any; config?: any }) {
    const existing = await this.prisma.integration.findFirst({ where: { type } });

    if (existing) {
      return this.prisma.integration.update({
        where: { id: existing.id },
        data: {
          isActive: data.isActive,
          credentials: data.credentials ?? existing.credentials,
          config: data.config ?? existing.config,
        },
      });
    }

    return this.prisma.integration.create({
      data: {
        type,
        isActive: data.isActive,
        credentials: data.credentials || {},
        config: data.config || {},
      },
    });
  }

  private async processMappedPayload(payload: any, source: string) {
    // A robust mapping utility to handle various vendor payload shapes
    const fullName = payload.name || payload.fullName || payload.customerName || 'Unknown Lead';
    const phone = payload.phone || payload.phoneNumber || payload.mobile || '0000000000';
    const email = payload.email || payload.customerEmail || null;
    
    // Attempt to extract project mapping if provided
    let projectId: string | undefined = undefined;
    if (payload.projectId) {
      projectId = payload.projectId;
    } else if (payload.projectName) {
       const project = await this.prisma.project.findFirst({ where: { name: { contains: payload.projectName, mode: 'insensitive' } } });
       if (project) projectId = project.id;
    }

    // Default round robin logic or admin assignment is handled at system level, here we leave it blank or handle auto-assign
    let assignedAgentId: string | undefined = undefined;
    const admin = await this.prisma.user.findFirst({ where: { role: 'ADMIN' } });
    if (admin) assignedAgentId = admin.id;

    const leadData = {
      fullName,
      phone,
      email,
      budgetMin: payload.budgetMin ? Number(payload.budgetMin) : 0,
      budgetMax: payload.budgetMax ? Number(payload.budgetMax) : 0,
      propertyType: payload.propertyType || 'FLAT',
      status: 'NEW',
      source,
      projectId,
      assignedAgentId,
      notes: payload.notes || payload.comments || `Imported via ${source} Integration`
    };

    return this.leadsService.createLead(leadData as any);
  }

  async handleFacebookPayload(payload: any) {
    // Facebook Lead Ads usually send field_data arrays, we flatten it
    let flattened = { ...payload };
    if (payload.field_data && Array.isArray(payload.field_data)) {
      payload.field_data.forEach((field: any) => {
        flattened[field.name] = field.values[0];
      });
    }
    return this.processMappedPayload(flattened, 'FACEBOOK_ADS');
  }

  async handle99AcresPayload(payload: any) {
    return this.processMappedPayload(payload, 'NINETY_NINE_ACRES');
  }

  async handleMagicbricksPayload(payload: any) {
    return this.processMappedPayload(payload, 'MAGICBRICKS');
  }

  async handleHousingPayload(payload: any) {
    return this.processMappedPayload(payload, 'HOUSING_COM');
  }
}
