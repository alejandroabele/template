import { IsEnum, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateAlquileRecursorDto {
    @IsString()
    codigo: string;

    @IsString()
    localidad: string;

    @IsString()
    zona: string;

    @IsOptional()
    @IsString()
    coordenadas?: string;

    @IsEnum(['FLOTA', 'TRAILERS', 'CARTELES', 'EQUIPAMIENTO'])
    tipo: 'FLOTA' | 'TRAILERS' | 'CARTELES' | 'EQUIPAMIENTO';

    @IsOptional()
    @IsString()
    proveedor?: string;

    @IsOptional()
    @IsString()
    alto?: string;

    @IsOptional()
    @IsString()
    ancho?: string;

    @IsOptional()
    @IsString()
    largo?: string;

    @IsEnum(['1', '2', '3'])
    formato: '1' | '2' | '3';

    @IsOptional()
    @IsString()
    modelo?: string;


}
