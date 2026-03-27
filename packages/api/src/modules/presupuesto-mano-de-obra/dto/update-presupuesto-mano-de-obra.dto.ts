import { PartialType } from '@nestjs/swagger';
import { CreatePresupuestoManoDeObraDto } from './create-presupuesto-mano-de-obra.dto';

export class UpdatePresupuestoManoDeObraDto extends PartialType(CreatePresupuestoManoDeObraDto) {}
