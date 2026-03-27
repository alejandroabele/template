import { Test, TestingModule } from '@nestjs/testing';
import { ContratoMarcoTalonarioService } from './contrato-marco-talonario.service';

describe('ContratoMarcoTalonarioService', () => {
  let service: ContratoMarcoTalonarioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContratoMarcoTalonarioService],
    }).compile();

    service = module.get<ContratoMarcoTalonarioService>(ContratoMarcoTalonarioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
