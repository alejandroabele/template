import { IsNotEmpty, IsNumber, IsDateString, IsPositive, IsOptional } from 'class-validator';

export class CreateBancoSaldoDto {
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    monto: number;

    @IsNotEmpty()
    @IsDateString()
    fecha: string;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    bancoId: number;

    @IsOptional()
    @IsNumber()
    descubiertoMonto?: number;

    @IsOptional()
    @IsNumber()
    descubiertoUso?: number;
}
