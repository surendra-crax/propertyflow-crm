import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RemindersService {
  private readonly logger = new Logger(RemindersService.name);

  constructor(private prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_HOUR)
  async sendFollowUpReminders() {
    this.logger.log('Running follow-up reminder check...');

    const now = new Date();
    const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    // Due within next 2 hours
    const dueSoon = await this.prisma.lead.findMany({
      where: {
        nextFollowup: { gte: now, lte: twoHoursLater },
        status: { notIn: ['CLOSED_WON', 'CLOSED_LOST'] },
      },
      include: { assignedAgent: true },
    });

    for (const lead of dueSoon) {
      await this.createNotification(
        lead.assignedAgentId,
        '⏰ Follow-up Due Soon',
        `Follow-up with ${lead.fullName} is due within 2 hours.`
      );
    }

    // Overdue
    const overdue = await this.prisma.lead.findMany({
      where: {
        nextFollowup: { lt: startOfToday },
        status: { notIn: ['CLOSED_WON', 'CLOSED_LOST'] },
      },
      include: { assignedAgent: true },
    });

    for (const lead of overdue) {
      await this.createNotification(
        lead.assignedAgentId,
        '🔴 Overdue Follow-up',
        `Follow-up with ${lead.fullName} is overdue. Please contact them now.`
      );
    }

    this.logger.log(`Reminders sent: ${dueSoon.length} due soon, ${overdue.length} overdue`);
  }

  private async createNotification(userId: string, title: string, message: string) {
    // Avoid spamming: check if same notification sent today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existing = await this.prisma.notification.findFirst({
      where: {
        userId,
        title,
        createdAt: { gte: today },
      },
    });

    if (!existing) {
      await this.prisma.notification.create({
        data: { userId, title, message },
      });
    }
  }
}
