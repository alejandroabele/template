import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateOfertaAprobacionDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsInt()
    ofertaId: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsInt()
    ofertaAprobacionTipoId: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsInt()
    aprobadorId?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    motivo?: string;
}
