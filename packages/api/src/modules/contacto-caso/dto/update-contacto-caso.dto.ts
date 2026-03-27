import { PartialType } from '@nestjs/swagger';
import { CreateContactoCasoDto } from './create-contacto-caso.dto';

export class UpdateContactoCasoDto extends PartialType(CreateContactoCasoDto) {}
