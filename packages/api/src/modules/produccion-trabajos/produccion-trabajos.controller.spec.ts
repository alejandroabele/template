import { Test, TestingModule } from '@nestjs/testing';
import { ProduccionTrabajosController } from './produccion-trabajos.controller';
import { ProduccionTrabajosService } from './produccion-trabajos.service';

describe('ProduccionTrabajosController', () => {
  let controller: ProduccionTrabajosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProduccionTrabajosController],
      providers: [ProduccionTrabajosService],
    }).compile();

    controller = module.get<ProduccionTrabajosController>(ProduccionTrabajosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
