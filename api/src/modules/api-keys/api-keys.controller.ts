import { Controller, Post, Get, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiKeysService } from './api-keys.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';

@Controller('api-keys')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ApiKeysController {
  constructor(private readonly apiKeysService: ApiKeysService) {}

  @Roles('ADMIN')
  @Post()
  generate(@Body() body: { label: string; expiresAt?: string }) {
    return this.apiKeysService.generateKey(body.label, body.expiresAt);
  }

  @Roles('ADMIN')
  @Get()
  list() {
    return this.apiKeysService.listKeys();
  }

  @Roles('ADMIN')
  @Delete(':id')
  revoke(@Param('id') id: string) {
    return this.apiKeysService.revokeKey(id);
  }
}
