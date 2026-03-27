import { Test, TestingModule } from '@nestjs/testing';
import { ContratoMarcoTalonarioItemController } from './contrato-marco-talonario-item.controller';
import { ContratoMarcoTalonarioItemService } from './contrato-marco-talonario-item.service';

describe('ContratoMarcoTalonarioItemController', () => {
  let controller: ContratoMarcoTalonarioItemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContratoMarcoTalonarioItemController],
      providers: [ContratoMarcoTalonarioItemService],
    }).compile();

    controller = module.get<ContratoMarcoTalonarioItemController>(ContratoMarcoTalonarioItemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
