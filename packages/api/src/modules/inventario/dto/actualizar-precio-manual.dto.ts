import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ActualizarPrecioManualDto {
    @IsString()
    @IsNotEmpty()
    precio: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    motivo: string;
}
