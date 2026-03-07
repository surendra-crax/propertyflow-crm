import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import * as bcrypt from 'bcrypt'

@Injectable()
export class UsersService {

    constructor(private prisma: PrismaService) { }

    async findAll(role?: string) {
        const where: any = {}
        if (role) {
            where.role = role
        }
        return this.prisma.user.findMany({
            where,
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                isActive: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' }
        })
    }

    async getAgents() {
        return this.prisma.user.findMany({
            where: { role: 'AGENT', isActive: true },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
            },
            orderBy: { name: 'asc' }
        })
    }

    async getManagers() {
        return this.prisma.user.findMany({
            where: { role: 'MANAGER', isActive: true },
            select: {
                id: true,
                name: true,
                email: true,
            },
            orderBy: { name: 'asc' }
        })
    }

    async createUser(data: {
        name: string
        email: string
        password: string
        phone?: string
        role: string
    }) {
        const hashed = await bcrypt.hash(data.password, 10)

        return this.prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashed,
                phone: data.phone,
                role: data.role as any,
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                isActive: true,
                createdAt: true,
            }
        })
    }

    async updateUser(id: string, data: any) {
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10)
        }
        return this.prisma.user.update({
            where: { id },
            data,
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                isActive: true,
            }
        })
    }

    async getNextAgentForAssignment() {
        const agents = await this.prisma.user.findMany({
            where: { role: 'AGENT', isActive: true },
            include: {
                leads: {
                    select: { id: true }
                }
            },
            orderBy: { name: 'asc' }
        })

        if (agents.length === 0) return null

        // Round robin: assign to agent with fewest leads
        agents.sort((a, b) => a.leads.length - b.leads.length)

        return agents[0]
    }
}
