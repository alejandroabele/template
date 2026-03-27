import { PartialType } from '@nestjs/swagger';
import { CreatePresupuestoLeidoDto } from './create-presupuesto-leido.dto';

export class UpdatePresupuestoLeidoDto extends PartialType(CreatePresupuestoLeidoDto) {}
