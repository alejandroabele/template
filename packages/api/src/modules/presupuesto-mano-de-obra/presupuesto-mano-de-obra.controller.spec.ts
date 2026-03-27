import { Test, TestingModule } from '@nestjs/testing';
import { PresupuestoManoDeObraController } from './presupuesto-mano-de-obra.controller';
import { PresupuestoManoDeObraService } from './presupuesto-mano-de-obra.service';

describe('PresupuestoManoDeObraController', () => {
  let controller: PresupuestoManoDeObraController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PresupuestoManoDeObraController],
      providers: [PresupuestoManoDeObraService],
    }).compile();

    controller = module.get<PresupuestoManoDeObraController>(PresupuestoManoDeObraController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
