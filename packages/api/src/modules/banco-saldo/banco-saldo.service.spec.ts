import { Test, TestingModule } from '@nestjs/testing';
import { BancoSaldoService } from './banco-saldo.service';

describe('BancoSaldoService', () => {
  let service: BancoSaldoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BancoSaldoService],
    }).compile();

    service = module.get<BancoSaldoService>(BancoSaldoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
