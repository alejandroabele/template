import { Test, TestingModule } from '@nestjs/testing';
import { ContratoMarcoPresupuestoItemController } from './contrato-marco-presupuesto-item.controller';
import { ContratoMarcoPresupuestoItemService } from './contrato-marco-presupuesto-item.service';

describe('ContratoMarcoPresupuestoItemController', () => {
  let controller: ContratoMarcoPresupuestoItemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContratoMarcoPresupuestoItemController],
      providers: [ContratoMarcoPresupuestoItemService],
    }).compile();

    controller = module.get<ContratoMarcoPresupuestoItemController>(ContratoMarcoPresupuestoItemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
