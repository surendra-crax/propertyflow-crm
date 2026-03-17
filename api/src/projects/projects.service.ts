import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { AuditLogService } from '../modules/audit-log/audit-log.service'

@Injectable()
export class ProjectsService {
  constructor(
    private prisma: PrismaService,
    private auditLog: AuditLogService
  ) { }

  // CREATE PROJECT
  async create(data: any) {
    const project = await this.prisma.project.create({
      data: {
        name: data.name,
        location: data.location,
        minPrice: data.minPrice,
        maxPrice: data.maxPrice,
        totalUnits: data.totalUnits,
        availableUnits: data.availableUnits,
        status: data.status,
        managerId: data.managerId
      }
    })

    // Audit log
    await this.auditLog.log({
      action: 'PROJECT_CREATED',
      entityType: 'PROJECT',
      entityId: project.id,
      newValue: { name: project.name, location: project.location }
    })

    return project
  }

  // GET PROJECTS
  async findAll() {
    return this.prisma.project.findMany({
      include: {
        manager: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  }

  // PROJECT ANALYTICS
  async getProjectAnalytics() {
    const projects = await this.prisma.project.findMany({
      include: {
        leads: true,
        deals: true
      }
    })

    return projects.map(project => {
      const soldUnits = project.totalUnits - project.availableUnits
      const revenue = project.deals.reduce(
        (sum, deal) => sum + deal.saleValue,
        0
      )
      const inventoryPercent = Math.round(
        (project.availableUnits / project.totalUnits) * 100
      )

      return {
        id: project.id,
        name: project.name,
        location: project.location,
        soldUnits,
        inventoryPercent,
        leadsCount: project.leads.length,
        dealsCount: project.deals.length,
        revenue
      }
    })
  }
}