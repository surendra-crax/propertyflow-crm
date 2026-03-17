import { Module } from '@nestjs/common'
import { ProjectsController } from './projects.controller'
import { ProjectsService } from './projects.service'
import { PrismaModule } from '../prisma/prisma.module'
import { AuditLogModule } from '../modules/audit-log/audit-log.module'

@Module({
  imports: [PrismaModule, AuditLogModule],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService]
})
export class ProjectsModule {}