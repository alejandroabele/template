import { IsArray, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class SaldoActualizacionDto {
  @IsNumber()
  bancoId: number;

  @IsNumber()
  monto: number;

  @IsNumber()
  descubiertoMonto: number;
}

export class ActualizarSaldosHoyDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SaldoActualizacionDto)
  saldos: SaldoActualizacionDto[];
}
