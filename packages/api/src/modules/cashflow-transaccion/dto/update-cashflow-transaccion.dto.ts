import { PartialType } from '@nestjs/swagger';
import { CreateCashflowTransaccionDto } from './create-cashflow-transaccion.dto';

export class UpdateCashflowTransaccionDto extends PartialType(CreateCashflowTransaccionDto) {}
