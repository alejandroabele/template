import { Test, TestingModule } from '@nestjs/testing';
import { AreaService } from './area.service';

describe('AreaService', () => {
  let service: AreaService;
  const mockEstadoRepository = {
    findAll: jest.fn().mockResolvedValue([]),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AreaService, {
        provide: 'AREA_REPOSITORY',
        useValue: mockEstadoRepository,
      }],
    }).compile();

    service = module.get<AreaService>(AreaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
