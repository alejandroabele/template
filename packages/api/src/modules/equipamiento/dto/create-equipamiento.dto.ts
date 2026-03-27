import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { EquipamientoTipo } from '../entities/equipamiento.entity';

export class CreateEquipamientoDto {
  @IsString()
  @IsNotEmpty()
  codigo: string;

  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsEnum(EquipamientoTipo)
  @IsNotEmpty()
  tipo: EquipamientoTipo;

  @IsOptional()
  @IsString()
  modelo?: string;

  @IsOptional()
  @IsString()
  numeroSerie?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;
}
