import { PartialType } from '@nestjs/swagger';
import { CreateBancoSaldoDto } from './create-banco-saldo.dto';

export class UpdateBancoSaldoDto extends PartialType(CreateBancoSaldoDto) {}
