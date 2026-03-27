import { Test, TestingModule } from '@nestjs/testing';
import { PresupuestoLeidoController } from './presupuesto-leido.controller';
import { PresupuestoLeidoService } from './presupuesto-leido.service';

describe('PresupuestoLeidoController', () => {
  let controller: PresupuestoLeidoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PresupuestoLeidoController],
      providers: [PresupuestoLeidoService],
    }).compile();

    controller = module.get<PresupuestoLeidoController>(PresupuestoLeidoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
