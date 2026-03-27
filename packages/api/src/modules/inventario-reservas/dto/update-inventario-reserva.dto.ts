import { PartialType } from '@nestjs/swagger';
import { CreateInventarioReservaDto } from './create-inventario-reserva.dto';

export class UpdateInventarioReservaDto extends PartialType(CreateInventarioReservaDto) {}
