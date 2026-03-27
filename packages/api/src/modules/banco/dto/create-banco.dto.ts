import { IsNotEmpty, IsString, MaxLength, IsOptional } from 'class-validator';

export class CreateBancoDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    nombre: string;

    @IsOptional()
    @IsString()
    @MaxLength(50)
    alias?: string;

    @IsOptional()
    @IsString()
    @MaxLength(50)
    nroCuenta?: string;

    @IsOptional()
    @IsString()
    @MaxLength(22)
    cbu?: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    tna?: string;
}
