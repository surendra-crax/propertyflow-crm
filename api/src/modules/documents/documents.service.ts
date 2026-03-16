import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EntityType, DocumentType } from '@prisma/client';

@Injectable()
export class DocumentsService {
  constructor(private prisma: PrismaService) {}

  async getDocumentsByEntity(entityType: EntityType, entityId: string) {
    return this.prisma.document.findMany({
      where: { entityType, entityId }
    });
  }

  async addDocument(data: { name: string; url: string; type: DocumentType; entityType: EntityType; entityId: string; }) {
    // AWS S3 upload logic would go here before DB save
    return this.prisma.document.create({ data });
  }

  async deleteDocument(id: string) {
    // AWS S3 deletion logic would go here
    return this.prisma.document.delete({ where: { id } });
  }
}
