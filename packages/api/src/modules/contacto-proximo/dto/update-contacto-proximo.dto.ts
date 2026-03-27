import { PartialType } from '@nestjs/mapped-types';
import { CreateContactoProximoDto } from './create-contacto-proximo.dto';

export class UpdateContactoProximoDto extends PartialType(CreateContactoProximoDto) {}
