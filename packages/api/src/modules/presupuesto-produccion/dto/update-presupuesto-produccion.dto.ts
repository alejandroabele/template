import { PartialType } from '@nestjs/swagger';
import { CreatePresupuestoProduccionDto } from './create-presupuesto-produccion.dto';

export class UpdatePresupuestoProduccionDto extends PartialType(CreatePresupuestoProduccionDto) {}
