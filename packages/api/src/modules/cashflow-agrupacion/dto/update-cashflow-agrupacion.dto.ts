import { PartialType } from '@nestjs/mapped-types';
import { CreateCashflowAgrupacionDto } from './create-cashflow-agrupacion.dto';

export class UpdateCashflowAgrupacionDto extends PartialType(CreateCashflowAgrupacionDto) {}
