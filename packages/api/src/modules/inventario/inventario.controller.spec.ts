import { Test, TestingModule } from '@nestjs/testing';
import { InventarioController } from './inventario.controller';
import { InventarioService } from './inventario.service';

describe('InventarioController', () => {
  let controller: InventarioController;

  beforeEach(async () => {
    const mockEstadoRepository = {
      findAll: jest.fn().mockResolvedValue([]),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventarioController],
      providers: [InventarioService, {
        provide: 'INVENTARIO_REPOSITORY',
        useValue: mockEstadoRepository,
      }],
    }).compile();

    controller = module.get<InventarioController>(InventarioController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
