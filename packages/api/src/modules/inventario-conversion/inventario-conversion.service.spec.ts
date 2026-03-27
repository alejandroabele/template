import { Test, TestingModule } from '@nestjs/testing';
import { InventarioConversionService } from './inventario-conversion.service';

describe('InventarioConversionService', () => {
  let service: InventarioConversionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InventarioConversionService],
    }).compile();

    service = module.get<InventarioConversionService>(InventarioConversionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
