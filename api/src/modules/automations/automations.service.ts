import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AutomationsService {
  constructor(private prisma: PrismaService) {}

  async getRules() {
    return this.prisma.automationRule.findMany();
  }

  async createRule(data: any) {
    return this.prisma.automationRule.create({ data });
  }

  async toggleRule(id: string, isActive: boolean) {
    return this.prisma.automationRule.update({
      where: { id },
      data: { isActive }
    });
  }
}
