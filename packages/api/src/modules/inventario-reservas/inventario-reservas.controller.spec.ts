import { Test, TestingModule } from '@nestjs/testing';
import { InventarioReservasController } from './inventario-reservas.controller';
import { InventarioReservasService } from './inventario-reservas.service';

describe('InventarioReservasController', () => {
  let controller: InventarioReservasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventarioReservasController],
      providers: [InventarioReservasService],
    }).compile();

    controller = module.get<InventarioReservasController>(InventarioReservasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
