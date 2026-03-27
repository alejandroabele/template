import { Test, TestingModule } from '@nestjs/testing';
import { AlquilerRecursoController } from './alquiler-recurso.controller';
import { AlquilerRecursoService } from './alquiler-recurso.service';

describe('AlquilerRecursoController', () => {
  let controller: AlquilerRecursoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlquilerRecursoController],
      providers: [AlquilerRecursoService],
    }).compile();

    controller = module.get<AlquilerRecursoController>(AlquilerRecursoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
