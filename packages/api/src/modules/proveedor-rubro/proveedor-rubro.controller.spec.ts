import { Test, TestingModule } from '@nestjs/testing';
import { ProveedorRubroController } from './proveedor-rubro.controller';
import { ProveedorRubroService } from './proveedor-rubro.service';

describe('ProveedorRubroController', () => {
  let controller: ProveedorRubroController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProveedorRubroController],
      providers: [ProveedorRubroService],
    }).compile();

    controller = module.get<ProveedorRubroController>(ProveedorRubroController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
