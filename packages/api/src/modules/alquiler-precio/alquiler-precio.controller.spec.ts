import { Test, TestingModule } from '@nestjs/testing';
import { AlquilerPrecioController } from './alquiler-precio.controller';
import { AlquilerPrecioService } from './alquiler-precio.service';

describe('AlquilerPrecioController', () => {
  let controller: AlquilerPrecioController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlquilerPrecioController],
      providers: [AlquilerPrecioService],
    }).compile();

    controller = module.get<AlquilerPrecioController>(AlquilerPrecioController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
