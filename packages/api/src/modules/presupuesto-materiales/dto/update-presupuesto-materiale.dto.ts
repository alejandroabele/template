import { PartialType } from '@nestjs/swagger';
import { CreatePresupuestoMaterialeDto } from './create-presupuesto-materiale.dto';

export class UpdatePresupuestoMaterialeDto extends PartialType(CreatePresupuestoMaterialeDto) {}
