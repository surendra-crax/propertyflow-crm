import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class ApiKeysService {
  constructor(private prisma: PrismaService) {}

  async generateKey(label: string, expiresAt?: string) {
    const raw = crypto.randomBytes(32).toString('hex');
    const keyHash = crypto.createHash('sha256').update(raw).digest('hex');

    await this.prisma.apiKey.create({
      data: {
        label,
        keyHash,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });

    // Return the raw key ONCE — it won't be retrievable again
    return { key: `pfcrm_${raw}`, label };
  }

  async listKeys() {
    return this.prisma.apiKey.findMany({
      orderBy: { createdAt: 'desc' },
      select: { id: true, label: true, isActive: true, expiresAt: true, createdAt: true },
    });
  }

  async revokeKey(id: string) {
    return this.prisma.apiKey.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async validateKey(rawKey: string): Promise<boolean> {
    const raw = rawKey.replace('pfcrm_', '');
    const keyHash = crypto.createHash('sha256').update(raw).digest('hex');

    const key = await this.prisma.apiKey.findUnique({ where: { keyHash } });
    if (!key || !key.isActive) return false;
    if (key.expiresAt && key.expiresAt < new Date()) return false;
    return true;
  }
}
