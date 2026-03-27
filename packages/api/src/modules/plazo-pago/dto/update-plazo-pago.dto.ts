import { PartialType } from '@nestjs/swagger';
import { CreatePlazoPagoDto } from './create-plazo-pago.dto';

export class UpdatePlazoPagoDto extends PartialType(CreatePlazoPagoDto) {}
