import { Test, TestingModule } from '@nestjs/testing';
import { InventarioCategoriaService } from './inventario-categoria.service';

describe('InventarioCategoriaService', () => {
  let service: InventarioCategoriaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InventarioCategoriaService],
    }).compile();

    service = module.get<InventarioCategoriaService>(InventarioCategoriaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
