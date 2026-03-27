import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateCashflowSimulacionTransaccionDto {
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
    @IsNumber()
    bancoId?: number;

    @ApiProperty({ required: false, default: false })
    @IsOptional()
    @IsBoolean()
    conciliado?: boolean;
}
