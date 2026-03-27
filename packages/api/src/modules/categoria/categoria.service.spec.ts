import { Test, TestingModule } from '@nestjs/testing';
import { CategoriaService } from './categoria.service';

describe('CategoriaService', () => {
  let service: CategoriaService;
  const mockEstadoRepository = {
    findAll: jest.fn().mockResolvedValue([]),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoriaService, {
        provide: 'CATEGORIA_REPOSITORY',
        useValue: mockEstadoRepository,
      }],
    }).compile();

    service = module.get<CategoriaService>(CategoriaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
