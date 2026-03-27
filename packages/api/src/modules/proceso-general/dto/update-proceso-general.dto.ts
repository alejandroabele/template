import { PartialType } from '@nestjs/swagger';
import { CreateProcesoGeneralDto } from './create-proceso-general.dto';

export class UpdateProcesoGeneralDto extends PartialType(CreateProcesoGeneralDto) {}
