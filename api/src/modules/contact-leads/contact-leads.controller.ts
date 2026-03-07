import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ContactLeadsService } from './contact-leads.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';

@Controller('contact-leads')
export class ContactLeadsController {
    constructor(private readonly contactLeadsService: ContactLeadsService) { }

    @Post()
    create(@Body() body: { name: string; company?: string; email: string; phone: string; teamSize?: string; message?: string }) {
        return this.contactLeadsService.create(body);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @Get()
    findAll() {
        return this.contactLeadsService.findAll();
    }
}
