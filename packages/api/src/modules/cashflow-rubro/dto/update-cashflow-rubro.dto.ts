import { PartialType } from '@nestjs/swagger';
import { CreateCashflowRubroDto } from './create-cashflow-rubro.dto';

export class UpdateCashflowRubroDto extends PartialType(CreateCashflowRubroDto) {}
