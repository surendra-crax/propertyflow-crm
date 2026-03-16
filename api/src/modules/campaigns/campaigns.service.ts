import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CampaignsService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    return this.prisma.campaign.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async create(data: any) {
    return this.prisma.campaign.create({ data });
  }

  async update(id: string, data: any) {
    return this.prisma.campaign.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.prisma.campaign.delete({ where: { id } });
  }

  async getROI() {
    const campaigns = await this.prisma.campaign.findMany({ orderBy: { createdAt: 'desc' } });

    return campaigns.map(c => {
      const cpl = c.leadsGenerated > 0 ? c.adSpend / c.leadsGenerated : null;
      const cpsv = c.visitsGenerated > 0 ? c.adSpend / c.visitsGenerated : null;
      const cpb = c.bookings > 0 ? c.adSpend / c.bookings : null;
      const conversionRate = c.leadsGenerated > 0 ? (c.bookings / c.leadsGenerated) * 100 : 0;

      return { ...c, cpl, cpsv, cpb, conversionRate: parseFloat(conversionRate.toFixed(1)) };
    });
  }
}
