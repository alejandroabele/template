import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PresupuestoSuministrosService } from './presupuesto-suministros.service';
import { CreatePresupuestoSuministroDto } from './dto/create-presupuesto-suministro.dto';
import { UpdatePresupuestoSuministroDto } from './dto/update-presupuesto-suministro.dto';
import { RequirePermissions } from '../auth/decorators/require-permissions/require-permissions.decorator';
import { ApiKeyGuard } from '../auth/guards/api-key/api-key.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { PERMISOS } from '@/constants/permisos';
import { AuthorizationGuard } from '../auth/guards/authorization/authorization.guard';


@UseGuards(JwtAuthGuard, ApiKeyGuard, AuthorizationGuard)
@Controller('presupuesto-suministros')
export class PresupuestoSuministrosController {
  constructor(private readonly presupuestoSuministrosService: PresupuestoSuministrosService) { }

  @Post()
  @RequirePermissions(PERMISOS.PRESUPUESTO_SUMINISTROS_CREAR)
  create(@Body() createPresupuestoSuministroDto: CreatePresupuestoSuministroDto) {
    return this.presupuestoSuministrosService.create(createPresupuestoSuministroDto);
  }

  @Get()
  @RequirePermissions(PERMISOS.PRESUPUESTO_SUMINISTROS_VER)
  findAll() {
    return this.presupuestoSuministrosService.findAll();
  }

  @Get(':id')
  @RequirePermissions(PERMISOS.PRESUPUESTO_SUMINISTROS_VER)
  findOne(@Param('id') id: string) {
    return this.presupuestoSuministrosService.findOne(+id);
  }

  @Patch(':id')
  @RequirePermissions(PERMISOS.PRESUPUESTO_SUMINISTROS_EDITAR)
  update(@Param('id') id: string, @Body() updatePresupuestoSuministroDto: UpdatePresupuestoSuministroDto) {
    return this.presupuestoSuministrosService.update(+id, updatePresupuestoSuministroDto);
  }

  @Delete(':id')
  @RequirePermissions(PERMISOS.PRESUPUESTO_SUMINISTROS_ELIMINAR)
  remove(@Param('id') id: string) {
    return this.presupuestoSuministrosService.remove(+id);
  }
}
