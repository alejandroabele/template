import { Test, TestingModule } from '@nestjs/testing';
import { PresupuestoMaterialesService } from './presupuesto-materiales.service';

describe('PresupuestoMaterialesService', () => {
  let service: PresupuestoMaterialesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PresupuestoMaterialesService],
    }).compile();

    service = module.get<PresupuestoMaterialesService>(PresupuestoMaterialesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
