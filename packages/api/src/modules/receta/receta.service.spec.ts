import { Test, TestingModule } from '@nestjs/testing';
import { RecetaService } from './receta.service';

describe('RecetaService', () => {
  let service: RecetaService;

  beforeEach(async () => {
    const mockEstadoRepository = {
      findAll: jest.fn().mockResolvedValue([]),
    };
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<RecetaService>(RecetaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
