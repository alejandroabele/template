import { PartialType } from '@nestjs/swagger';
import { CreatePresupuestoSuministroDto } from './create-presupuesto-suministro.dto';

export class UpdatePresupuestoSuministroDto extends PartialType(CreatePresupuestoSuministroDto) {}
