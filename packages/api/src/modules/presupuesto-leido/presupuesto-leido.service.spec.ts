import { Test, TestingModule } from '@nestjs/testing';
import { PresupuestoLeidoService } from './presupuesto-leido.service';

describe('PresupuestoLeidoService', () => {
  let service: PresupuestoLeidoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PresupuestoLeidoService],
    }).compile();

    service = module.get<PresupuestoLeidoService>(PresupuestoLeidoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
