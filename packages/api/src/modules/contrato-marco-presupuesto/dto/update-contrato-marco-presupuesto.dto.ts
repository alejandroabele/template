import { PartialType } from '@nestjs/swagger';
import { CreateContratoMarcoPresupuestoDto } from './create-contrato-marco-presupuesto.dto';

export class UpdateContratoMarcoPresupuestoDto extends PartialType(CreateContratoMarcoPresupuestoDto) {}
