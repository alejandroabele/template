import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class RechazarOfertaAprobacionDto {
    @ApiProperty({ description: 'Motivo del rechazo' })
    @IsNotEmpty({ message: 'El motivo es obligatorio para rechazar' })
    @IsString()
    @MaxLength(255)
    motivo: string;
}
