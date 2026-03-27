import { IsOptional, IsString } from 'class-validator';

export class CreateTrailerDto {
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
}
