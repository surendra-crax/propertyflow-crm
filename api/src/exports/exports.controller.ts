import {
    Controller,
    Get,
    Res,
    UseGuards
} from '@nestjs/common'

import { ExportsService } from './exports.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { RolesGuard } from '../auth/roles.guard'
import { Roles } from '../auth/roles.decorator'
import type { Response } from 'express'

@Controller('exports')
export class ExportsController {

    constructor(private exportsService: ExportsService) { }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'MANAGER')
    @Get('leads')
    async exportLeads(@Res() res: Response) {
        const csv = await this.exportsService.exportLeadsCSV()
        res.setHeader('Content-Type', 'text/csv')
        res.setHeader('Content-Disposition', 'attachment; filename=leads.csv')
        res.send(csv)
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'MANAGER')
    @Get('deals')
    async exportDeals(@Res() res: Response) {
        const csv = await this.exportsService.exportDealsCSV()
        res.setHeader('Content-Type', 'text/csv')
        res.setHeader('Content-Disposition', 'attachment; filename=deals.csv')
        res.send(csv)
    }
}
