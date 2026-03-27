import { PartialType } from '@nestjs/swagger';
import { CreateProveedorRubroDto } from './create-proveedor-rubro.dto';

export class UpdateProveedorRubroDto extends PartialType(CreateProveedorRubroDto) {}
