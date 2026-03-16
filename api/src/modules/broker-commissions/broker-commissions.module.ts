import { Module } from '@nestjs/common';
import { BrokerCommissionsService } from './broker-commissions.service';
import { BrokerCommissionsController } from './broker-commissions.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BrokerCommissionsController],
  providers: [BrokerCommissionsService],
  exports: [BrokerCommissionsService]
})
export class BrokerCommissionsModule {}
