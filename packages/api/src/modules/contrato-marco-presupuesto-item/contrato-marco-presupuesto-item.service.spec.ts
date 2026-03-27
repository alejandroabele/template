import { Test, TestingModule } from '@nestjs/testing';
import { ContratoMarcoPresupuestoItemService } from './contrato-marco-presupuesto-item.service';

describe('ContratoMarcoPresupuestoItemService', () => {
  let service: ContratoMarcoPresupuestoItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContratoMarcoPresupuestoItemService],
    }).compile();

    service = module.get<ContratoMarcoPresupuestoItemService>(ContratoMarcoPresupuestoItemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
