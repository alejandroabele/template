import { Test, TestingModule } from '@nestjs/testing';
import { RecetaController } from './receta.controller';
import { RecetaService } from './receta.service';

describe('RecetaController', () => {
  let controller: RecetaController;

  beforeEach(async () => {
    const mockEstadoRepository = {
      findAll: jest.fn().mockResolvedValue([]),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecetaController],
      providers: [RecetaService, {
        provide: 'RECETA_REPOSITORY',
        useValue: mockEstadoRepository,
      }, {
          provide: 'INVENTARIO_REPOSITORY',
          useValue: mockEstadoRepository,
        }, {
          provide: 'RECETA_INVENTARIO_REPOSITORY',
          useValue: mockEstadoRepository,
        }],
    }).compile();

    controller = module.get<RecetaController>(RecetaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
