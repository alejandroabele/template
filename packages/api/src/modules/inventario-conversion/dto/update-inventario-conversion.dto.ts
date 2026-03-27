import { PartialType } from '@nestjs/swagger';
import { CreateInventarioConversionDto } from './create-inventario-conversion.dto';

export class UpdateInventarioConversionDto extends PartialType(CreateInventarioConversionDto) {}
