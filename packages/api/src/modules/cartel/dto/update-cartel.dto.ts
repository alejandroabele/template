import { PartialType } from '@nestjs/mapped-types';
import { CreateCartelDto } from './create-cartel.dto';

export class UpdateCartelDto extends PartialType(CreateCartelDto) {}
