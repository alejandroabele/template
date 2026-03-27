import { Test, TestingModule } from '@nestjs/testing';
import { ClienteController } from './cliente.controller';
import { ClienteService } from './cliente.service';

describe('ClienteController', () => {
  let controller: ClienteController;

  beforeEach(async () => {
    const mockEstadoRepository = {
      findAll: jest.fn().mockResolvedValue([]),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClienteController],
      providers: [ClienteService, {
        provide: 'CLIENTE_REPOSITORY',
        useValue: mockEstadoRepository,
      }],
    }).compile();

    controller = module.get<ClienteController>(ClienteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
