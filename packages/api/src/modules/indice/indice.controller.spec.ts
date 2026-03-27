import { Test, TestingModule } from '@nestjs/testing';
import { IndiceController } from './indice.controller';
import { IndiceService } from './indice.service';

describe('IndiceController', () => {
  let controller: IndiceController;
  beforeEach(async () => {
    const mockEstadoRepository = {
      findAll: jest.fn().mockResolvedValue([]),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IndiceController],
      providers: [IndiceService, {
        provide: 'INDICE_REPOSITORY',
        useValue: mockEstadoRepository,
      }],
    }).compile();
    controller = module.get<IndiceController>(IndiceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
