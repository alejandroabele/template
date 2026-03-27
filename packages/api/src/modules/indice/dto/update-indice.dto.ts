import { PartialType } from '@nestjs/swagger';
import { CreateIndiceDto } from './create-indice.dto';

export class UpdateIndiceDto extends PartialType(CreateIndiceDto) {}
