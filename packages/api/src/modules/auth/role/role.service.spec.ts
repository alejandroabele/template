import { Test, TestingModule } from '@nestjs/testing';
import { RoleService } from './role.service';

describe('RoleService', () => {
  let service: RoleService;
  const mockEstadoRepository = {
    findAll: jest.fn().mockResolvedValue([]),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoleService, {
        provide: 'ROLE_REPOSITORY',
        useValue: mockEstadoRepository,
      }],
    }).compile();

    service = module.get<RoleService>(RoleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
