import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsOptional, IsDecimal, IsBoolean } from 'class-validator';

export class CreateCashflowTransaccionDto {
    @ApiProperty()
    @IsNumber()
    categoriaId: number;

    @ApiProperty()
    @IsString()
    fecha: string;

    @ApiProperty()
    @IsNumber()
    monto: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    descripcion?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    modelo?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    modeloId?: number;

    @ApiProperty({ required: false, default: false })
    @IsOptional()
    @IsBoolean()
    proyectado?: boolean;
}
