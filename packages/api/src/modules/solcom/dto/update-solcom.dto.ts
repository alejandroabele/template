import { PartialType } from '@nestjs/swagger';
import { CreateSolcomDto } from './create-solcom.dto';

export class UpdateSolcomDto extends PartialType(CreateSolcomDto) {}
