import { Test, TestingModule } from '@nestjs/testing';
import { AlquilerMantenimientoController } from './alquiler-mantenimiento.controller';
import { AlquilerMantenimientoService } from './alquiler-mantenimiento.service';

describe('AlquilerMantenimientoController', () => {
  let controller: AlquilerMantenimientoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlquilerMantenimientoController],
      providers: [AlquilerMantenimientoService],
    }).compile();

    controller = module.get<AlquilerMantenimientoController>(AlquilerMantenimientoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
