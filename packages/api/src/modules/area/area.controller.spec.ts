import { Test, TestingModule } from '@nestjs/testing';
import { AreaController } from './area.controller';
import { AreaService } from './area.service';

describe('AreaController', () => {
  let controller: AreaController;

  beforeEach(async () => {
    const mockEstadoRepository = {
      findAll: jest.fn().mockResolvedValue([]),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AreaController],
      providers: [AreaService,  {
        provide: 'AREA_REPOSITORY',
        useValue: mockEstadoRepository,
      }],
    }).compile();

    controller = module.get<AreaController>(AreaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
