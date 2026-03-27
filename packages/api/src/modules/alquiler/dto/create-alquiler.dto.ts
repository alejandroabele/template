import { IsEnum, IsInt, IsOptional, IsString, IsDateString, IsArray, IsNumber } from 'class-validator';
import { AlquilerPrecio } from '@/modules/alquiler-precio/entities/alquiler-precio.entity';
import { AlquilerMantenimiento } from '@/modules/alquiler-mantenimiento/entities/alquiler-mantenimiento.entity';

export class CreateAlquilerDto {
    @IsString()
    localidad: string;

    @IsString()
    zona: string;

    @IsOptional()
    @IsString()
    coordenadas?: string;

    @IsOptional()
    @IsString()
    fichaTecnic?: string;

    @IsOptional()
    @IsString()
    contratoPdf?: string;

    @IsDateString()
    inicioContrato: Date;

    @IsDateString()
    vencimientoContrato: Date;

    @IsInt()
    precio: number;

    @IsEnum(['LIBRE', 'ARRENDADO', 'EN_NEGOCIACION'])
    estado: 'LIBRE' | 'ARRENDADO' | 'EN_NEGOCIACION';

    @IsOptional()
    @IsDateString()
    fechaLimiteNegociacion?: Date;

    @IsOptional()
    @IsString()
    notas?: string;


    @IsInt()
    alquilerRecursoId: number;

    @IsEnum(['FLOTA', 'TRAILERS', 'CARTELES', 'EQUIPAMIENTO'])
    tipo: 'FLOTA' | 'TRAILERS' | 'CARTELES' | 'EQUIPAMIENTO';

    @IsOptional()
    @IsArray()
    precios?: AlquilerPrecio[];

    @IsOptional()
    @IsArray()
    mantenimientos?: AlquilerMantenimiento[];

    @IsNumber()
    clienteId: number;
}
