import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class AprobarOfertaAprobacionDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    motivo?: string;
}
