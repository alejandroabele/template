import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class FlotaAsignacionDto {
  @ApiProperty()
  @IsNumber()
  flotaId: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  personaResponsableId?: number;
}

export class EquipamientoAsignacionDto {
  @ApiProperty()
  @IsNumber()
  equipamientoId: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  personaResponsableId?: number;
}

export class PersonaTrabajoDto {
  @ApiProperty()
  @IsNumber()
  personaId: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  produccionTrabajoId?: number;
}

export class CreateJornadaDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  fecha?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  detalle?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  anotaciones?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  cancelado?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  motivoCancelacion?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  presupuestoId?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  tipo?: string;

  @ApiProperty({ required: false, type: [PersonaTrabajoDto] })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => PersonaTrabajoDto)
  personasTrabajos?: PersonaTrabajoDto[];

  @ApiProperty({ required: false, type: [FlotaAsignacionDto] })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => FlotaAsignacionDto)
  flotas?: FlotaAsignacionDto[];

  @ApiProperty({ required: false, type: [EquipamientoAsignacionDto] })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => EquipamientoAsignacionDto)
  equipamientos?: EquipamientoAsignacionDto[];

  // Mantener compatibilidad con versión anterior
  @ApiProperty({ required: false })
  @IsArray()
  @IsOptional()
  personasIds?: number[];

  @ApiProperty({ required: false })
  @IsArray()
  @IsOptional()
  flotaIds?: number[];

  @ApiProperty({ required: false })
  @IsArray()
  @IsOptional()
  equipamientoIds?: number[];
}
