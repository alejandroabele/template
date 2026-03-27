import { Test, TestingModule } from '@nestjs/testing';
import { ContratoMarcoPresupuestoController } from './contrato-marco-presupuesto.controller';
import { ContratoMarcoPresupuestoService } from './contrato-marco-presupuesto.service';

describe('ContratoMarcoPresupuestoController', () => {
  let controller: ContratoMarcoPresupuestoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContratoMarcoPresupuestoController],
      providers: [ContratoMarcoPresupuestoService],
    }).compile();

    controller = module.get<ContratoMarcoPresupuestoController>(ContratoMarcoPresupuestoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
