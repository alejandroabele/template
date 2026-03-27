import { Test, TestingModule } from '@nestjs/testing';
import { InventarioCategoriaController } from './inventario-categoria.controller';
import { InventarioCategoriaService } from './inventario-categoria.service';

describe('InventarioCategoriaController', () => {
  let controller: InventarioCategoriaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventarioCategoriaController],
      providers: [InventarioCategoriaService],
    }).compile();

    controller = module.get<InventarioCategoriaController>(InventarioCategoriaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
