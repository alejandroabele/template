import { PartialType } from '@nestjs/mapped-types';
import { CreateInventarioSubcategoriaDto } from './create-inventario-subcategoria.dto';

export class UpdateInventarioSubcategoriaDto extends PartialType(CreateInventarioSubcategoriaDto) {}
