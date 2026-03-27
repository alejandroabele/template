import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsOptional, IsString } from "class-validator";

export class CreateClienteDto {
  @ApiProperty()
  @IsString()
  nombre: string;

  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsString()
  direccion: string;

  @ApiProperty()
  @IsString()
  ciudad: string;

  @ApiProperty()
  @IsString()
  codigoPostal: string;

  @ApiProperty()
  @IsString()
  telefono: string;

  @ApiProperty()
  @IsString()
  nombreContacto: string;

  @ApiProperty()
  @IsDate()
  createdAt: Date;

  @ApiProperty()
  @IsString()
  razonSocial: string;

  @ApiProperty()
  @IsString()
  cuit: string;

  @ApiProperty()
  @IsString()
  direccionFiscal: string;

  @ApiProperty()
  @IsString()
  telefonoContacto: string;

  @ApiProperty()
  @IsString()
  formaDePago: string;

  @ApiProperty()
  @IsString()
  detalles: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  emailPagoProveedores?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  nombreContactoPagoProveedores?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  telefonoPagoProveedores?: string;
}
