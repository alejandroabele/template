import { Test, TestingModule } from '@nestjs/testing';
import { MovimientoInventarioController } from './movimiento-inventario.controller';
import { MovimientoInventarioService } from './movimiento-inventario.service';

describe('MovimientoInventarioController', () => {
  let controller: MovimientoInventarioController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MovimientoInventarioController],
      providers: [MovimientoInventarioService],
    }).compile();

    controller = module.get<MovimientoInventarioController>(MovimientoInventarioController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
