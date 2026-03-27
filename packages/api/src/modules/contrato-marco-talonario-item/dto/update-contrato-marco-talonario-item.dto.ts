import { PartialType } from '@nestjs/swagger';
import { CreateContratoMarcoTalonarioItemDto } from './create-contrato-marco-talonario-item.dto';

export class UpdateContratoMarcoTalonarioItemDto extends PartialType(CreateContratoMarcoTalonarioItemDto) {}
