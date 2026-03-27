import { Test, TestingModule } from '@nestjs/testing';
import { PresupuestoMaterialesController } from './presupuesto-materiales.controller';
import { PresupuestoMaterialesService } from './presupuesto-materiales.service';

describe('PresupuestoMaterialesController', () => {
  let controller: PresupuestoMaterialesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PresupuestoMaterialesController],
      providers: [PresupuestoMaterialesService],
    }).compile();

    controller = module.get<PresupuestoMaterialesController>(PresupuestoMaterialesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
