import { PartialType } from '@nestjs/swagger';
import { CreateInventarioCategoriaDto } from './create-inventario-categoria.dto';

export class UpdateInventarioCategoriaDto extends PartialType(CreateInventarioCategoriaDto) {}
