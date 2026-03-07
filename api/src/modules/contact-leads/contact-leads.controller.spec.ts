import { Test, TestingModule } from '@nestjs/testing';
import { ContactLeadsController } from './contact-leads.controller';

describe('ContactLeadsController', () => {
  let controller: ContactLeadsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContactLeadsController],
    }).compile();

    controller = module.get<ContactLeadsController>(ContactLeadsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
