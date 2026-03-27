import { Test, TestingModule } from '@nestjs/testing';
import { ProveedorRubroService } from './proveedor-rubro.service';

describe('ProveedorRubroService', () => {
  let service: ProveedorRubroService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProveedorRubroService],
    }).compile();

    service = module.get<ProveedorRubroService>(ProveedorRubroService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
