import { Test, TestingModule } from '@nestjs/testing';
import { InventarioConversionController } from './inventario-conversion.controller';
import { InventarioConversionService } from './inventario-conversion.service';

describe('InventarioConversionController', () => {
  let controller: InventarioConversionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventarioConversionController],
      providers: [InventarioConversionService],
    }).compile();

    controller = module.get<InventarioConversionController>(InventarioConversionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
