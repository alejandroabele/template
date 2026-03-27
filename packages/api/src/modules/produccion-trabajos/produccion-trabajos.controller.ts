import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ProduccionTrabajosService } from './produccion-trabajos.service';
import { CreateProduccionTrabajoDto } from './dto/create-produccion-trabajo.dto';
import { UpdateProduccionTrabajoDto } from './dto/update-produccion-trabajo.dto';
import { PERMISOS } from '@/constants/permisos';
import { AuthorizationGuard } from '../auth/guards/authorization/authorization.guard';
import { RequirePermissions } from '../auth/decorators/require-permissions/require-permissions.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { ApiKeyGuard } from '../auth/guards/api-key/api-key.guard';



@Controller('produccion-trabajos')
@UseGuards(JwtAuthGuard, ApiKeyGuard, AuthorizationGuard)
export class ProduccionTrabajosController {
  constructor(private readonly produccionTrabajosService: ProduccionTrabajosService) { }

  @Post()
  @RequirePermissions(PERMISOS.PRESUPUESTO_TRABAJOS_CREAR)
  create(@Body() createProduccionTrabajoDto: CreateProduccionTrabajoDto) {
    return this.produccionTrabajosService.create(createProduccionTrabajoDto);
  }

  @RequirePermissions(PERMISOS.PRESUPUESTO_TRABAJOS_VER)
  @Get()
  findAll(
    @Query('limit') take: number,
    @Query('skip') skip: number,
    @Query('filter') filter: string,
    @Query('order') order: string,
    @Query('search') search: string,
  ) {
    const where = filter ? JSON.parse(filter) : [];
    const orderBy = order
      ? JSON.parse(order)
      : {};
    const options = {
      where,
      order: orderBy,
      take,
      skip,
      search
    };
    return this.produccionTrabajosService.findAll(options);
  }

  @RequirePermissions(PERMISOS.PRESUPUESTO_TRABAJOS_VER)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.produccionTrabajosService.findOne(+id);
  }

  @RequirePermissions(PERMISOS.PRESUPUESTO_TRABAJOS_EDITAR)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProduccionTrabajoDto: UpdateProduccionTrabajoDto) {
    return this.produccionTrabajosService.update(+id, updateProduccionTrabajoDto);
  }

  @RequirePermissions(PERMISOS.PRESUPUESTO_TRABAJOS_ELIMINAR)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.produccionTrabajosService.remove(+id);
  }
}
