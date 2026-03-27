import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { PresupuestoProduccionService } from './presupuesto-produccion.service';
import { CreatePresupuestoProduccionDto } from './dto/create-presupuesto-produccion.dto';
import { UpdatePresupuestoProduccionDto } from './dto/update-presupuesto-produccion.dto';
import { RequirePermissions } from '../auth/decorators/require-permissions/require-permissions.decorator';
import { ApiKeyGuard } from '../auth/guards/api-key/api-key.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { AuthorizationGuard } from '../auth/guards/authorization/authorization.guard';
import { PERMISOS } from '@/constants/permisos';

@Controller('presupuesto-produccion')
@UseGuards(JwtAuthGuard, ApiKeyGuard, AuthorizationGuard)
export class PresupuestoProduccionController {
  constructor(private readonly presupuestoProduccionService: PresupuestoProduccionService) { }

  @RequirePermissions(PERMISOS.PRESUPUESTO_PRODUCCION_CREAR)
  @Post()
  create(@Body() createDto: CreatePresupuestoProduccionDto) {
    return this.presupuestoProduccionService.create(createDto);
  }

  @RequirePermissions(PERMISOS.PRESUPUESTO_PRODUCCION_VER)
  @Get()
  findAll(
    @Query('limit') take: number,
    @Query('skip') skip: number,
    @Query('filter') filter: string,
    @Query('order') order: string,
    @Query('search') search: string,


  ) {
    const where = filter ? JSON.parse(filter) : [];
    const orderBy = order ? JSON.parse(order) : {};

    const options = {
      where,
      order: orderBy,
      take,
      skip,
      search
    };

    return this.presupuestoProduccionService.findAll(options);
  }

  @RequirePermissions(PERMISOS.PRESUPUESTO_PRODUCCION_VER)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.presupuestoProduccionService.findOne(id);
  }

  @RequirePermissions(PERMISOS.PRESUPUESTO_PRODUCCION_EDITAR)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdatePresupuestoProduccionDto) {
    return this.presupuestoProduccionService.update(id, updateDto);
  }

  @RequirePermissions(PERMISOS.PRESUPUESTO_PRODUCCION_ELIMINAR)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.presupuestoProduccionService.remove(id);
  }
}
