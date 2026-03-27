import { Test, TestingModule } from '@nestjs/testing';
import { ContratoMarcoPresupuestoService } from './contrato-marco-presupuesto.service';

describe('ContratoMarcoPresupuestoService', () => {
  let service: ContratoMarcoPresupuestoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContratoMarcoPresupuestoService],
    }).compile();

    service = module.get<ContratoMarcoPresupuestoService>(ContratoMarcoPresupuestoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
