import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class ExportsService {

    constructor(private prisma: PrismaService) { }

    async exportLeadsCSV(): Promise<string> {

        const leads = await this.prisma.lead.findMany({
            include: {
                project: true,
                assignedAgent: {
                    select: { name: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        const headers = [
            'Full Name', 'Phone', 'Email', 'Budget Min', 'Budget Max',
            'Property Type', 'Status', 'Source', 'Project', 'Agent',
            'Next Follow-up', 'Created At'
        ]

        const rows = leads.map(lead => [
            lead.fullName,
            lead.phone,
            lead.email || '',
            lead.budgetMin,
            lead.budgetMax,
            lead.propertyType,
            lead.status,
            lead.source,
            lead.project?.name || '',
            lead.assignedAgent?.name || '',
            lead.nextFollowup ? new Date(lead.nextFollowup).toISOString() : '',
            new Date(lead.createdAt).toISOString(),
        ])

        const csv = [
            headers.join(','),
            ...rows.map(row =>
                row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(',')
            )
        ].join('\n')

        return csv
    }

    async exportDealsCSV(): Promise<string> {

        const deals = await this.prisma.deal.findMany({
            include: {
                lead: true,
                project: true,
                broker: true,
            },
            orderBy: { createdAt: 'desc' }
        })

        const headers = [
            'Client', 'Phone', 'Project', 'Sale Value', 'Broker',
            'Commission', 'Notes', 'Closed At', 'Created At'
        ]

        const rows = deals.map(deal => [
            deal.lead?.fullName || '',
            deal.lead?.phone || '',
            deal.project?.name || '',
            deal.saleValue,
            deal.broker?.name || 'Direct',
            deal.commissionAmount,
            deal.notes || '',
            new Date(deal.closedAt).toISOString(),
            new Date(deal.createdAt).toISOString(),
        ])

        const csv = [
            headers.join(','),
            ...rows.map(row =>
                row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(',')
            )
        ].join('\n')

        return csv
    }
}
