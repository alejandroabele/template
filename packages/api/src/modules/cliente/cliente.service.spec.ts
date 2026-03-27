import { Test, TestingModule } from '@nestjs/testing';
import { ClienteService } from './cliente.service';

describe('ClienteService', () => {
  let service: ClienteService;

  beforeEach(async () => {
    const mockEstadoRepository = {
      findAll: jest.fn().mockResolvedValue([]),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClienteService, {
        provide: 'CLIENTE_REPOSITORY',
        useValue: mockEstadoRepository,
      }],
    }).compile();

    service = module.get<ClienteService>(ClienteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
