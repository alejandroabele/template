import { Test, TestingModule } from '@nestjs/testing';
import { ProcesoGeneralService } from './proceso-general.service';

describe('ProcesoGeneralService', () => {
  let service: ProcesoGeneralService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProcesoGeneralService],
    }).compile();

    service = module.get<ProcesoGeneralService>(ProcesoGeneralService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
