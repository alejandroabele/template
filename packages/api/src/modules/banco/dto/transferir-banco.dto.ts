import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class TransferirBancoDto {
    @IsNotEmpty()
    @IsNumber()
    bancoOrigenId: number;

    @IsNotEmpty()
    @IsNumber()
    bancoDestinoId: number;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    monto: number;
}
