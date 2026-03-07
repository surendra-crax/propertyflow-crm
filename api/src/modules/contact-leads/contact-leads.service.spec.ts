import { Test, TestingModule } from '@nestjs/testing';
import { ContactLeadsService } from './contact-leads.service';

describe('ContactLeadsService', () => {
  let service: ContactLeadsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContactLeadsService],
    }).compile();

    service = module.get<ContactLeadsService>(ContactLeadsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
