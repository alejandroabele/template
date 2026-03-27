import { Test, TestingModule } from '@nestjs/testing';
import { CashflowCategoriaService } from './cashflow-categoria.service';

describe('CashflowCategoriaService', () => {
  let service: CashflowCategoriaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CashflowCategoriaService],
    }).compile();

    service = module.get<CashflowCategoriaService>(CashflowCategoriaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
