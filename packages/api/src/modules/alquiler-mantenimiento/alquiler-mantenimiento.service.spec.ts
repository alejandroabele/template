import { Test, TestingModule } from '@nestjs/testing';
import { AlquilerMantenimientoService } from './alquiler-mantenimiento.service';

describe('AlquilerMantenimientoService', () => {
  let service: AlquilerMantenimientoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AlquilerMantenimientoService],
    }).compile();

    service = module.get<AlquilerMantenimientoService>(AlquilerMantenimientoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
