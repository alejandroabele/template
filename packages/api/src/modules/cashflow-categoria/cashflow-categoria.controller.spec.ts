import { Test, TestingModule } from '@nestjs/testing';
import { CashflowCategoriaController } from './cashflow-categoria.controller';
import { CashflowCategoriaService } from './cashflow-categoria.service';

describe('CashflowCategoriaController', () => {
  let controller: CashflowCategoriaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CashflowCategoriaController],
      providers: [CashflowCategoriaService],
    }).compile();

    controller = module.get<CashflowCategoriaController>(CashflowCategoriaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
