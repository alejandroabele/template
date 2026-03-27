import { PartialType } from '@nestjs/swagger';
import { CreateEquipamientoDto } from './create-equipamiento.dto';

export class UpdateEquipamientoDto extends PartialType(CreateEquipamientoDto) {}
