import { Module } from '@nestjs/common';
import { ContactLeadsController } from './contact-leads.controller';
import { ContactLeadsService } from './contact-leads.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ContactLeadsController],
  providers: [ContactLeadsService]
})
export class ContactLeadsModule { }
