import { Test, TestingModule } from '@nestjs/testing';
import { ContratoMarcoTalonarioController } from './contrato-marco-talonario.controller';
import { ContratoMarcoTalonarioService } from './contrato-marco-talonario.service';

describe('ContratoMarcoTalonarioController', () => {
  let controller: ContratoMarcoTalonarioController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContratoMarcoTalonarioController],
      providers: [ContratoMarcoTalonarioService],
    }).compile();

    controller = module.get<ContratoMarcoTalonarioController>(ContratoMarcoTalonarioController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
