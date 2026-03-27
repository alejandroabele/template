import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateRoleProcesoGeneralDto {
  @IsInt()
  @IsNotEmpty()
  roleId: number;

  @IsInt()
  @IsNotEmpty()
  procesoGeneralId: number;
}
