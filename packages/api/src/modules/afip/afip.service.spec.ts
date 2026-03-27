import { Test, TestingModule } from '@nestjs/testing';
import { AfipService } from './afip.service';

describe('AfipService', () => {
  let service: AfipService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AfipService],
    }).compile();

    service = module.get<AfipService>(AfipService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
