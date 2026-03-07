import { Controller, Get, UseGuards } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'

@Controller('test')
export class TestController {
  constructor(private prisma: PrismaService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async testDb() {
    const usersCount = await this.prisma.user.count()

    return {
      message: 'Protected route working',
      totalUsers: usersCount,
    }
  }
}