import { Test, TestingModule } from '@nestjs/testing';
import { IndiceService } from './indice.service';

describe('IndiceService', () => {
  let service: IndiceService;
  const mockEstadoRepository = {
    findAll: jest.fn().mockResolvedValue([]),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IndiceService, {
        provide: 'INDICE_REPOSITORY',
        useValue: mockEstadoRepository,
      }],
    }).compile();

    service = module.get<IndiceService>(IndiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
