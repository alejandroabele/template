import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { FlotaTipo } from '../entities/flota.entity';

export class CreateFlotaDto {
  @IsString()
  @IsNotEmpty()
  codigo: string;

  @IsEnum(FlotaTipo)
  @IsNotEmpty()
  tipo: FlotaTipo;

  @IsOptional()
  @IsString()
  marca?: string;

  @IsOptional()
  @IsString()
  modelo?: string;

  @IsOptional()
  @IsString()
  anio?: string;

  @IsOptional()
  @IsString()
  patente?: string;

  @IsOptional()
  @IsString()
  vin?: string;

  @IsOptional()
  @IsString()
  kilometraje?: string;

  @IsOptional()
  @IsString()
  capacidadKg?: string;

  @IsOptional()
  @IsString()
  cantidadEjes?: string;

  @IsOptional()
  @IsString()
  cantidadAuxilio?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;
}
