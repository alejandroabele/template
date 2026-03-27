import { Test, TestingModule } from '@nestjs/testing';
import { PresupuestoSuministrosController } from './presupuesto-suministros.controller';
import { PresupuestoSuministrosService } from './presupuesto-suministros.service';

describe('PresupuestoSuministrosController', () => {
  let controller: PresupuestoSuministrosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PresupuestoSuministrosController],
      providers: [PresupuestoSuministrosService],
    }).compile();

    controller = module.get<PresupuestoSuministrosController>(PresupuestoSuministrosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
