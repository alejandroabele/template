import { PartialType } from '@nestjs/swagger';
import { CreateContratoMarcoPresupuestoItemDto } from './create-contrato-marco-presupuesto-item.dto';

export class UpdateContratoMarcoPresupuestoItemDto extends PartialType(CreateContratoMarcoPresupuestoItemDto) {}
