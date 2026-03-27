import { PartialType } from '@nestjs/swagger';
import { CreateAlquileRecursorDto } from './create-alquiler-recurso.dto';

export class UpdateAlquilerRecursoDto extends PartialType(CreateAlquileRecursorDto) { }
