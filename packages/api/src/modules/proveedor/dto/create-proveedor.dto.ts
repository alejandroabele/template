import { IsEmail, IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateProveedorDto {
    @IsOptional()
    @IsString()
    codigo?: string;

    @IsNotEmpty()
    @IsString()
    cuit: string;

    @IsNotEmpty()
    @IsString()
    razonSocial: string;

    @IsOptional()
    @IsString()
    nombreFantasia?: string;

    @IsNotEmpty()
    @IsString()
    domicilio: string;

    @IsNotEmpty()
    @IsString()
    localidad: string;

    @IsNotEmpty()
    @IsString()
    telefonoContacto1: string;

    @IsOptional()
    @IsString()
    telefonoContacto2?: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsOptional()
    @IsString()
    numeroIngresosBrutos?: string;

    @IsOptional()
    @IsString()
    notas?: string;

    @IsNotEmpty()
    @IsString()
    condicionFrenteIva: string;

    @IsOptional()
    @IsNumber()
    proveedorRubroId?: number;

    @IsOptional()
    @IsString()
    web?: string;

    @IsOptional()
    @IsString()
    contactoCobranzasNombre?: string;

    @IsOptional()
    @IsEmail()
    contactoCobranzasEmail?: string;

    @IsOptional()
    @IsString()
    contactoCobranzasTelefono?: string;
}
