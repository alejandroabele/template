import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PresupuestoMaterialesService } from './presupuesto-materiales.service';
import { CreatePresupuestoMaterialeDto } from './dto/create-presupuesto-materiale.dto';
import { UpdatePresupuestoMaterialeDto } from './dto/update-presupuesto-materiale.dto';
import { PERMISOS } from '@/constants/permisos';
import { AuthorizationGuard } from '../auth/guards/authorization/authorization.guard';
import { RequirePermissions } from '../auth/decorators/require-permissions/require-permissions.decorator';
import { ApiKeyGuard } from '../auth/guards/api-key/api-key.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';

@Controller('presupuesto-materiales')
@UseGuards(JwtAuthGuard, ApiKeyGuard, AuthorizationGuard)
export class PresupuestoMaterialesController {
  constructor(private readonly presupuestoMaterialesService: PresupuestoMaterialesService) { }

  @Post()
  @RequirePermissions(PERMISOS.PRESUPUESTO_MATERIALES_CREAR)
  create(@Body() createPresupuestoMaterialeDto: CreatePresupuestoMaterialeDto) {
    return this.presupuestoMaterialesService.create(createPresupuestoMaterialeDto);
  }

  @Get()
  @RequirePermissions(PERMISOS.PRESUPUESTO_MATERIALES_VER)
  findAll() {
    return this.presupuestoMaterialesService.findAll();
  }

  @Get(':id')
  @RequirePermissions(PERMISOS.PRESUPUESTO_MATERIALES_VER)
  findOne(@Param('id') id: string) {
    return this.presupuestoMaterialesService.findOne(+id);
  }

  @Patch(':id')
  @RequirePermissions(PERMISOS.PRESUPUESTO_MATERIALES_EDITAR)
  update(@Param('id') id: string, @Body() updatePresupuestoMaterialeDto: UpdatePresupuestoMaterialeDto) {
    return this.presupuestoMaterialesService.update(+id, updatePresupuestoMaterialeDto);
  }

  @Delete(':id')
  @RequirePermissions(PERMISOS.PRESUPUESTO_MATERIALES_ELIMINAR)
  remove(@Param('id') id: string) {
    return this.presupuestoMaterialesService.remove(+id);
  }
}
