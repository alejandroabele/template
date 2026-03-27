import { IsString, IsNotEmpty, IsEnum, MinLength } from 'class-validator';

export class CreateCashflowCategoriaDto {
    @IsString({ message: 'El nombre debe ser un string' })
    @IsNotEmpty({ message: 'El nombre es requerido' })
    @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
    nombre: string;

    @IsEnum(['ingreso', 'egreso'], { message: 'El tipo debe ser "ingreso" o "egreso"' })
    @IsNotEmpty({ message: 'El tipo es requerido' })
    tipo: 'ingreso' | 'egreso';
}
