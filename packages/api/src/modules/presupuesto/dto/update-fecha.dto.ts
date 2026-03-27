import { PartialType } from '@nestjs/swagger';
import { CreatePresupuestoDto } from './create-presupuesto.dto';

export class UpdateFechaDto extends PartialType(CreatePresupuestoDto) {

    observaciones: string
}
