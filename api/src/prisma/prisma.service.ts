import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const baseUrl = process.env.DATABASE_URL ?? '';
    const sep = baseUrl.includes('?') ? '&' : '?';
    // Increase pool size and timeouts — Render free tier defaults to 1 connection
    const url = `${baseUrl}${sep}connection_limit=5&pool_timeout=30&connect_timeout=30`;
    super({ datasources: { db: { url } } });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
