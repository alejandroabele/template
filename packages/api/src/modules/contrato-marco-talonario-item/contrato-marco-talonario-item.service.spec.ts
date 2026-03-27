import { Test, TestingModule } from '@nestjs/testing';
import { ContratoMarcoTalonarioItemService } from './contrato-marco-talonario-item.service';

describe('ContratoMarcoTalonarioItemService', () => {
  let service: ContratoMarcoTalonarioItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContratoMarcoTalonarioItemService],
    }).compile();

    service = module.get<ContratoMarcoTalonarioItemService>(ContratoMarcoTalonarioItemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
