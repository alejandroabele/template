import { PartialType } from '@nestjs/swagger';
import { CreateAlquilerMantenimientoDto } from './create-alquiler-mantenimiento.dto';

export class UpdateAlquilerMantenimientoDto extends PartialType(CreateAlquilerMantenimientoDto) {}
