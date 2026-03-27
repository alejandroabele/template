import { Test, TestingModule } from '@nestjs/testing';
import { AlquilerPrecioService } from './alquiler-precio.service';

describe('AlquilerPrecioService', () => {
  let service: AlquilerPrecioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AlquilerPrecioService],
    }).compile();

    service = module.get<AlquilerPrecioService>(AlquilerPrecioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
