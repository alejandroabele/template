import { PartialType } from '@nestjs/mapped-types';
import { CreateFlotaDto } from './create-flota.dto';

export class UpdateFlotaDto extends PartialType(CreateFlotaDto) {}
