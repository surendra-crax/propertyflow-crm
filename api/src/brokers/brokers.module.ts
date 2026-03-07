import { Module } from '@nestjs/common'
import { BrokersService } from './brokers.service'
import { BrokersController } from './brokers.controller'
import { PrismaModule } from '../prisma/prisma.module'

@Module({
  imports: [PrismaModule],
  controllers: [BrokersController],
  providers: [BrokersService],
})
export class BrokersModule {}