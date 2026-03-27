import { PartialType } from '@nestjs/swagger';
import { CreateCobroDto } from './create-cobro.dto';

export class UpdateCobroDto extends PartialType(CreateCobroDto) {}
