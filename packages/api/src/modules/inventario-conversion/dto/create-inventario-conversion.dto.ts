import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateInventarioConversionDto {
  @IsString()
  cantidad: string;

  @IsString()
  unidadOrigen: string;

  @IsString()
  unidadDestino: string;

  @IsNumber()
  inventarioId: number;

  @IsOptional()
  @IsString()
  descripcion?: string;
}
