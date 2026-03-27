import { Test, TestingModule } from '@nestjs/testing';
import { PresupuestoProduccionController } from './presupuesto-produccion.controller';
import { PresupuestoProduccionService } from './presupuesto-produccion.service';

describe('PresupuestoProduccionController', () => {
  let controller: PresupuestoProduccionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PresupuestoProduccionController],
      providers: [PresupuestoProduccionService],
    }).compile();

    controller = module.get<PresupuestoProduccionController>(PresupuestoProduccionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
