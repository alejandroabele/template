import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePersonaDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  apellido: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  dni: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  fechaNacimiento?: string;
}
