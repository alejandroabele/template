import { PartialType } from '@nestjs/swagger';
import { CreateAlquilerPrecioDto } from './create-alquiler-precio.dto';

export class UpdateAlquilerPrecioDto extends PartialType(CreateAlquilerPrecioDto) {}
