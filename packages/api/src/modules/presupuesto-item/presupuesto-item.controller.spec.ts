import { Test, TestingModule } from '@nestjs/testing';
import { PresupuestoItemController } from './presupuesto-item.controller';
import { PresupuestoItemService } from './presupuesto-item.service';

describe('PresupuestoItemController', () => {
  let controller: PresupuestoItemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PresupuestoItemController],
      providers: [PresupuestoItemService],
    }).compile();

    controller = module.get<PresupuestoItemController>(PresupuestoItemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
