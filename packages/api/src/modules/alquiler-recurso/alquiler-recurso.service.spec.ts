import { Test, TestingModule } from '@nestjs/testing';
import { AlquilerRecursoService } from './alquiler-recurso.service';

describe('AlquilerRecursoService', () => {
  let service: AlquilerRecursoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AlquilerRecursoService],
    }).compile();

    service = module.get<AlquilerRecursoService>(AlquilerRecursoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
