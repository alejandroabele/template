import { PartialType } from '@nestjs/swagger';
import { CreateCashflowCategoriaDto } from './create-cashflow-categoria.dto';

export class UpdateCashflowCategoriaDto extends PartialType(CreateCashflowCategoriaDto) {}
