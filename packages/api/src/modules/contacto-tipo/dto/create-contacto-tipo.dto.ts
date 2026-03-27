import { IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateContactoTipoDto {
  @IsString()
  @MaxLength(50)
  nombre: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  icono?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  color?: string;
}
