import { Test, TestingModule } from '@nestjs/testing';
import { PresupuestoItemService } from './presupuesto-item.service';

describe('PresupuestoItemService', () => {
  let service: PresupuestoItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PresupuestoItemService],
    }).compile();

    service = module.get<PresupuestoItemService>(PresupuestoItemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
