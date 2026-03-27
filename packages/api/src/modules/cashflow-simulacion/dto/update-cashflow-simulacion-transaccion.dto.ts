import { PartialType } from '@nestjs/swagger';
import { CreateCashflowSimulacionTransaccionDto } from './create-cashflow-simulacion-transaccion.dto';

export class UpdateCashflowSimulacionTransaccionDto extends PartialType(CreateCashflowSimulacionTransaccionDto) {}
