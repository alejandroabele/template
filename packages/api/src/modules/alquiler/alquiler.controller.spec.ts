import { Test, TestingModule } from '@nestjs/testing';
import { AlquilerController } from './alquiler.controller';
import { AlquilerService } from './alquiler.service';

describe('AlquilerController', () => {
  let controller: AlquilerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlquilerController],
      providers: [AlquilerService],
    }).compile();

    controller = module.get<AlquilerController>(AlquilerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
