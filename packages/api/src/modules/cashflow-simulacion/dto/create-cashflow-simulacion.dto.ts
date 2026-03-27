import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsIn } from 'class-validator';

export class CreateCashflowSimulacionDto {
    @ApiProperty()
    @IsString()
    nombre: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    descripcion?: string;

    @ApiProperty({ enum: ['desde_cero', 'desde_actual'] })
    @IsIn(['desde_cero', 'desde_actual'])
    tipo: 'desde_cero' | 'desde_actual';
}
