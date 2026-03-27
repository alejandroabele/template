import { Test, TestingModule } from '@nestjs/testing';
import { InventarioReservasService } from './inventario-reservas.service';

describe('InventarioReservasService', () => {
  let service: InventarioReservasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InventarioReservasService],
    }).compile();

    service = module.get<InventarioReservasService>(InventarioReservasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
