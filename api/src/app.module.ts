import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { LeadsModule } from './leads/leads.module';
import { SiteVisitsModule } from './site-visits/site-visits.module';
import { DealsModule } from './deals/deals.module';
import { BrokersModule } from './brokers/brokers.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ProjectsModule } from './projects/projects.module';
import { ActivitiesModule } from './activities/activities.module';
import { UsersModule } from './users/users.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ExportsModule } from './exports/exports.module';
import { ContactLeadsModule } from './modules/contact-leads/contact-leads.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    ProjectsModule,
    LeadsModule,
    SiteVisitsModule,
    DealsModule,
    BrokersModule,
    AnalyticsModule,
    DashboardModule,
    ActivitiesModule,
    UsersModule,
    NotificationsModule,
    ExportsModule,
    ContactLeadsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }