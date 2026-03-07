import {
    Controller,
    Get,
    Post,
    Patch,
    Body,
    Param,
    Query,
    UseGuards,
} from '@nestjs/common'

import { UsersService } from './users.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { RolesGuard } from '../auth/roles.guard'
import { Roles } from '../auth/roles.decorator'

@Controller('users')
export class UsersController {

    constructor(private usersService: UsersService) { }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'MANAGER')
    @Get()
    findAll(@Query('role') role?: string) {
        return this.usersService.findAll(role)
    }

    @UseGuards(JwtAuthGuard)
    @Get('agents')
    getAgents() {
        return this.usersService.getAgents()
    }

    @UseGuards(JwtAuthGuard)
    @Get('managers')
    getManagers() {
        return this.usersService.getManagers()
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @Get('next-agent')
    getNextAgent() {
        return this.usersService.getNextAgentForAssignment()
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @Post()
    create(@Body() body: any) {
        return this.usersService.createUser(body)
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @Patch(':id')
    update(@Param('id') id: string, @Body() body: any) {
        return this.usersService.updateUser(id, body)
    }
}
