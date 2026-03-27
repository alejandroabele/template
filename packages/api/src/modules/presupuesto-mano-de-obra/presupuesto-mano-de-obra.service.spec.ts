import { Test, TestingModule } from '@nestjs/testing';
import { PresupuestoManoDeObraService } from './presupuesto-mano-de-obra.service';

describe('PresupuestoManoDeObraService', () => {
  let service: PresupuestoManoDeObraService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PresupuestoManoDeObraService],
    }).compile();

    service = module.get<PresupuestoManoDeObraService>(PresupuestoManoDeObraService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
