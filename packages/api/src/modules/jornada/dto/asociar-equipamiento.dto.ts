import { IsArray, IsNumber } from 'class-validator';

export class AsociarEquipamientoDto {
  @IsArray()
  @IsNumber({}, { each: true })
  equipamientoIds: number[];
}
