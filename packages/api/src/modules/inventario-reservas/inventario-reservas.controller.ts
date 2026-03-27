import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiKeyGuard } from '../auth/guards/api-key/api-key.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { InventarioReservasService } from './inventario-reservas.service'
import { CreateInventarioReservaDto } from './dto/create-inventario-reserva.dto';
import { UpdateInventarioReservaDto } from './dto/update-inventario-reserva.dto';
import { PERMISOS } from '@/constants/permisos';
import { AuthorizationGuard } from '../auth/guards/authorization/authorization.guard';
import { RequirePermissions } from '../auth/decorators/require-permissions/require-permissions.decorator';



@Controller('inventario-reservas')
@UseGuards(JwtAuthGuard, ApiKeyGuard, AuthorizationGuard)
export class InventarioReservasController {
  constructor(private readonly inventarioReservaService: InventarioReservasService) { }

  @Post()
  @RequirePermissions(PERMISOS.INVENTARIO_RESERVA_CREAR)
  create(@Body() createInventarioReservaDto: CreateInventarioReservaDto) {
    return this.inventarioReservaService.create(createInventarioReservaDto);
  }

  @Get()
  @RequirePermissions(PERMISOS.INVENTARIO_RESERVA_VER)
  findAll(
    @Query('limit') take: number,
    @Query('skip') skip: number,
    @Query('filter') filter: string, // Recibe el filtro como string
    @Query('order') order: string,  // Recibe el orden como string

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
    };

    return this.inventarioReservaService.findAll(options);
  }


  @Get(':id')
  @RequirePermissions(PERMISOS.INVENTARIO_RESERVA_VER)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.inventarioReservaService.findOne(id);
  }

  @Patch(':id')
  @RequirePermissions(PERMISOS.INVENTARIO_RESERVA_EDITAR)
  update(@Param('id', ParseIntPipe) id: number, @Body() updateAreaDto: UpdateInventarioReservaDto) {
    return this.inventarioReservaService.update(id, updateAreaDto);
  }
  @Delete(':id')
  @RequirePermissions(PERMISOS.INVENTARIO_RESERVA_ELIMINAR)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.inventarioReservaService.remove(id);
  }

  @Get('presupuesto/:presupuestoId')
  @RequirePermissions(PERMISOS.INVENTARIO_RESERVA_VER)
  findByPresupuesto(@Param('presupuestoId', ParseIntPipe) presupuestoId: number) {
    return this.inventarioReservaService.findByPresupuesto(presupuestoId);
  }

  @Get('presupuesto/:presupuestoId/trabajo/:trabajoId')
  @RequirePermissions(PERMISOS.INVENTARIO_RESERVA_VER)
  findByPresupuestoAndTrabajo(
    @Param('presupuestoId', ParseIntPipe) presupuestoId: number,
    @Param('trabajoId', ParseIntPipe) trabajoId: number
  ) {
    return this.inventarioReservaService.findByPresupuestoAndTrabajo(presupuestoId, trabajoId);
  }

  @Get('centro-costo/:centroCostoId')
  @RequirePermissions(PERMISOS.INVENTARIO_RESERVA_VER)
  findByCentroCosto(@Param('centroCostoId', ParseIntPipe) centroCostoId: number) {
    return this.inventarioReservaService.findByCentroCosto(centroCostoId);
  }
}
