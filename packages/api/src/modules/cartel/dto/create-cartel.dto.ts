import { IsOptional, IsString } from 'class-validator';

export class CreateCartelDto {
    @IsString()
    codigo: string;

    @IsString()
    proveedor: string;

    @IsOptional()
    @IsString()
    formato?: string;

    @IsOptional()
    @IsString()
    alto?: string;

    @IsOptional()
    @IsString()
    largo?: string;

    @IsOptional()
    @IsString()
    localidad?: string;

    @IsOptional()
    @IsString()
    zona?: string;

    @IsOptional()
    @IsString()
    coordenadas?: string;
}
