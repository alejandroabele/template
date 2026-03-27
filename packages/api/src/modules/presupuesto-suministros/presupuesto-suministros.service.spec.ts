import { Test, TestingModule } from '@nestjs/testing';
import { PresupuestoSuministrosService } from './presupuesto-suministros.service';

describe('PresupuestoSuministrosService', () => {
  let service: PresupuestoSuministrosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PresupuestoSuministrosService],
    }).compile();

    service = module.get<PresupuestoSuministrosService>(PresupuestoSuministrosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
