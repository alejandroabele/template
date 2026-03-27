import { PartialType } from '@nestjs/swagger';
import { CreateProduccionTrabajoDto } from './create-produccion-trabajo.dto';

export class UpdateProduccionTrabajoDto extends PartialType(CreateProduccionTrabajoDto) {}
