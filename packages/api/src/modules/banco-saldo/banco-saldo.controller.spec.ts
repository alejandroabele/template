import { Test, TestingModule } from '@nestjs/testing';
import { BancoSaldoController } from './banco-saldo.controller';
import { BancoSaldoService } from './banco-saldo.service';

describe('BancoSaldoController', () => {
  let controller: BancoSaldoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BancoSaldoController],
      providers: [BancoSaldoService],
    }).compile();

    controller = module.get<BancoSaldoController>(BancoSaldoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
