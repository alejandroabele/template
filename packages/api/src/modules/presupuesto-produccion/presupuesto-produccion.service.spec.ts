import { Test, TestingModule } from '@nestjs/testing';
import { PresupuestoProduccionService } from './presupuesto-produccion.service';

describe('PresupuestoProduccionService', () => {
  let service: PresupuestoProduccionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PresupuestoProduccionService],
    }).compile();

    service = module.get<PresupuestoProduccionService>(PresupuestoProduccionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
