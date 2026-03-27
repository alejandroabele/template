import { PartialType } from '@nestjs/swagger';
import { CreateAfipDto } from './create-afip.dto';

export class UpdateAfipDto extends PartialType(CreateAfipDto) {}
