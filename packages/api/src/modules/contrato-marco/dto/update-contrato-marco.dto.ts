import { PartialType } from '@nestjs/swagger';
import { CreateContratoMarcoDto } from './create-contrato-marco.dto';

export class UpdateContratoMarcoDto extends PartialType(CreateContratoMarcoDto) {}
