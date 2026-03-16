import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UnitsService {
  constructor(private prisma: PrismaService) {}

  async getUnitsByProject(projectId: string) {
    return this.prisma.unit.findMany({ where: { projectId } });
  }

  async createUnit(projectId: string, data: any) {
    return this.prisma.unit.create({
      data: { ...data, projectId }
    });
  }

  async updateUnit(id: string, data: any) {
    return this.prisma.unit.update({
      where: { id },
      data
    });
  }
}
