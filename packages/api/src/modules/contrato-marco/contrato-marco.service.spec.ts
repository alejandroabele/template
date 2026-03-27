import { Test, TestingModule } from '@nestjs/testing';
import { ContratoMarcoService } from './contrato-marco.service';

describe('ContratoMarcoService', () => {
  let service: ContratoMarcoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContratoMarcoService],
    }).compile();

    service = module.get<ContratoMarcoService>(ContratoMarcoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
