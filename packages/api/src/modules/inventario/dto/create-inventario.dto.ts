import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString, IsBoolean, IsOptional, IsDate } from "class-validator";
import { isDate } from "util/types";

export class CreateInventarioDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    id?: number;

    @ApiProperty()
    @IsString()
    nombre: string;

    @ApiProperty()
    @IsString()
    sku: string;

    @ApiProperty()
    @IsNumber()
    punit: number;

    @ApiProperty()
    @IsBoolean()
    manejaStock: boolean;

    @ApiProperty()
    @IsNumber()
    stock: number;

    @ApiProperty()
    @IsNumber()
    alerta: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    unidadMedida?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    descripcion?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    stockMinimo?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    stockMaximo?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    stockReservado?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    categoriaId?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    inventarioCategoriaId?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    inventarioSubcategoriaId?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    cuentaContableId?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    alicuota?: string;

    @IsOptional()
    deletedAt?: string | null;
    @IsOptional()
    deletedBy?: number | null;
}
