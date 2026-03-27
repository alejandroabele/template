import { PartialType } from '@nestjs/swagger';
import { CreateContratoMarcoTalonarioDto } from './create-contrato-marco-talonario.dto';

export class UpdateContratoMarcoTalonarioDto extends PartialType(CreateContratoMarcoTalonarioDto) {
    fechaInicio: string;
    fechaFin: string;
    contratoMarcoId: string;
    items: any;
}
