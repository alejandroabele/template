import { Test, TestingModule } from '@nestjs/testing';
import { CashflowTransaccionService } from './cashflow-transaccion.service';

describe('CashflowTransaccionService', () => {
  let service: CashflowTransaccionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CashflowTransaccionService],
    }).compile();

    service = module.get<CashflowTransaccionService>(CashflowTransaccionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
