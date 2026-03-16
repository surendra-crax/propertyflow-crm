import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TenantConfigService {
  constructor(private prisma: PrismaService) {}

  async getConfig() {
    let config = await this.prisma.tenantConfig.findFirst();
    if (!config) {
      config = await this.prisma.tenantConfig.create({
        data: {
          companyName: 'My Real Estate CRM',
          brandColor: '#4f46e5',
        },
      });
    }
    return config;
  }

  async updateConfig(data: {
    companyName?: string;
    logoUrl?: string;
    brandColor?: string;
    emailSignature?: string;
  }) {
    const config = await this.getConfig();
    return this.prisma.tenantConfig.update({
      where: { id: config.id },
      data,
    });
  }
}
