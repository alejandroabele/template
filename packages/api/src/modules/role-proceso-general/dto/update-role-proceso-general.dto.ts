import { PartialType } from '@nestjs/swagger';
import { CreateRoleProcesoGeneralDto } from './create-role-proceso-general.dto';

export class UpdateRoleProcesoGeneralDto extends PartialType(CreateRoleProcesoGeneralDto) {}
