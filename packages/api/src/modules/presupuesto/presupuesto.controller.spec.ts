import { Test, TestingModule } from '@nestjs/testing';
import { PresupuestoController } from './presupuesto.controller';
import { PresupuestoService } from './presupuesto.service';

describe('PresupuestoController', () => {
  let controller: PresupuestoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PresupuestoController],
      providers: [PresupuestoService],
    }).compile();

    controller = module.get<PresupuestoController>(PresupuestoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
