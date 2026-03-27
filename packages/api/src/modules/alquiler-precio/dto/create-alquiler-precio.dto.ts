import { IsInt, IsOptional, IsDate, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAlquilerPrecioDto {
    @IsOptional()
    @IsInt()
    id?: number;

    @IsNotEmpty()
    @IsInt()
    alquilerId: number;

    @IsNotEmpty()
    @IsInt()
    clienteId: number;

    @IsNotEmpty()
    @IsInt()
    precio: number;

    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    fechaDesde: Date;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    fechaFin?: Date;
}
