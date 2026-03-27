import { Test, TestingModule } from '@nestjs/testing';
import { ProduccionTrabajosService } from './produccion-trabajos.service';

describe('ProduccionTrabajosService', () => {
  let service: ProduccionTrabajosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProduccionTrabajosService],
    }).compile();

    service = module.get<ProduccionTrabajosService>(ProduccionTrabajosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
