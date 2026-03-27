import { Test, TestingModule } from '@nestjs/testing';
import { CashflowTransaccionController } from './cashflow-transaccion.controller';
import { CashflowTransaccionService } from './cashflow-transaccion.service';

describe('CashflowTransaccionController', () => {
  let controller: CashflowTransaccionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CashflowTransaccionController],
      providers: [CashflowTransaccionService],
    }).compile();

    controller = module.get<CashflowTransaccionController>(CashflowTransaccionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
