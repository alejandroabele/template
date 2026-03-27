import { Test, TestingModule } from '@nestjs/testing';
import { ProcesoGeneralController } from './proceso-general.controller';
import { ProcesoGeneralService } from './proceso-general.service';

describe('ProcesoGeneralController', () => {
  let controller: ProcesoGeneralController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProcesoGeneralController],
      providers: [ProcesoGeneralService],
    }).compile();

    controller = module.get<ProcesoGeneralController>(ProcesoGeneralController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
