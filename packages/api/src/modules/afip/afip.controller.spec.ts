import { Test, TestingModule } from '@nestjs/testing';
import { AfipController } from './afip.controller';
import { AfipService } from './afip.service';

describe('AfipController', () => {
  let controller: AfipController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AfipController],
      providers: [AfipService],
    }).compile();

    controller = module.get<AfipController>(AfipController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
