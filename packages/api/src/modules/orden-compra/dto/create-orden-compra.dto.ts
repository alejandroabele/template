import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateOrdenCompraDto {
  @IsNotEmpty({ message: 'El ID de la oferta es obligatorio' })
  @IsNumber({}, { message: 'El ID de la oferta debe ser un número' })
  ofertaId: number;
}
