import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { LeadsModule } from './leads/leads.module';
import { SiteVisitsModule } from './site-visits/site-visits.module';
import { DealsModule } from './deals/deals.module';
import { BrokersModule } from './brokers/brokers.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ProjectsModule } from './projects/projects.module';
import { ActivitiesModule } from './activities/activities.module';
import { UsersModule } from './users/users.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ExportsModule } from './exports/exports.module';
import { ContactLeadsModule } from './modules/contact-leads/contact-leads.module';
import { TenantConfigModule } from './modules/tenant-config/tenant-config.module';
import { IntegrationsModule } from './modules/integrations/integrations.module';
import { UnitsModule } from './modules/units/units.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { AutomationsModule } from './modules/automations/automations.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { BrokerCommissionsModule } from './modules/broker-commissions/broker-commissions.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { BulkImportModule } from './modules/bulk-import/bulk-import.module';
import { AuditLogModule } from './modules/audit-log/audit-log.module';
import { RemindersModule } from './modules/reminders/reminders.module';
import { ApiKeysModule } from './modules/api-keys/api-keys.module';
import { HealthController } from './health/health.controller';
import { CampaignsModule } from './modules/campaigns/campaigns.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),
    PrismaModule,
    AuthModule,
    ProjectsModule,
    LeadsModule,
    SiteVisitsModule,
    DealsModule,
    BrokersModule,
    DashboardModule,
    ActivitiesModule,
    UsersModule,
    NotificationsModule,
    ExportsModule,
    ContactLeadsModule,
    TenantConfigModule,
    IntegrationsModule,
    UnitsModule,
    PaymentsModule,
    AutomationsModule,
    DocumentsModule,
    BrokerCommissionsModule,
    AnalyticsModule,
    BulkImportModule,
    AuditLogModule,
    RemindersModule,
    ApiKeysModule,
    CampaignsModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule { }