import { PartialType } from '@nestjs/swagger';
import { CreateContactoTipoDto } from './create-contacto-tipo.dto';

export class UpdateContactoTipoDto extends PartialType(CreateContactoTipoDto) {}
