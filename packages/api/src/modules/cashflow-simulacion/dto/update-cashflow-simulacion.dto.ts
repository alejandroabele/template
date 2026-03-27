import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateCashflowSimulacionDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    nombre?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    descripcion?: string;
}
