import { PartialType } from '@nestjs/swagger';
import { CreateOfertaAprobacionDto } from './create-oferta-aprobacion.dto';

export class UpdateOfertaAprobacionDto extends PartialType(CreateOfertaAprobacionDto) {}
