import { Test, TestingModule } from '@nestjs/testing';
import { ContratoMarcoController } from './contrato-marco.controller';
import { ContratoMarcoService } from './contrato-marco.service';

describe('ContratoMarcoController', () => {
  let controller: ContratoMarcoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContratoMarcoController],
      providers: [ContratoMarcoService],
    }).compile();

    controller = module.get<ContratoMarcoController>(ContratoMarcoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
