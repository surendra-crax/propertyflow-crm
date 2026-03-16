import { Controller, Get, Post, Delete, Body, Param, Query } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { EntityType, DocumentType } from '@prisma/client';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get()
  getDocuments(@Query('entityType') entityType: EntityType, @Query('entityId') entityId: string) {
    return this.documentsService.getDocumentsByEntity(entityType, entityId);
  }

  @Post()
  addDocument(@Body() data: { name: string; url: string; type: DocumentType; entityType: EntityType; entityId: string; }) {
    return this.documentsService.addDocument(data);
  }

  @Delete(':id')
  deleteDocument(@Param('id') id: string) {
    return this.documentsService.deleteDocument(id);
  }
}
