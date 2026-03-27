import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioService } from './usuario.service';

describe('UsuarioService', () => {
  let service: UsuarioService;
  const mockEstadoRepository = {
    findAll: jest.fn().mockResolvedValue([]),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsuarioService, {
        provide: 'USUARIO_REPOSITORY',
        useValue: mockEstadoRepository,
      }],
    }).compile();

    service = module.get<UsuarioService>(UsuarioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
