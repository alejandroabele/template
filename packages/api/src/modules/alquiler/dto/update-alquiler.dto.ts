import { PartialType } from '@nestjs/swagger';
import { CreateAlquilerDto } from './create-alquiler.dto';

export class UpdateAlquilerDto extends PartialType(CreateAlquilerDto) {}
