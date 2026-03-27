import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiKeyGuard } from '../auth/guards/api-key/api-key.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { MovimientoInventarioService } from './movimiento-inventario.service'
import { CreateMovimientoInventarioDto } from './dto/create-movimiento-inventario.dto';
import { UpdateMovimientoInventarioDto } from './dto/update-movimiento-inventario.dto';
import { EgresoMasivoDto } from './dto/egreso-masivo.dto';
import { PERMISOS } from '@/constants/permisos';
import { AuthorizationGuard } from '../auth/guards/authorization/authorization.guard';
import { RequirePermissions } from '../auth/decorators/require-permissions/require-permissions.decorator';



@Controller('movimiento-inventario')
@UseGuards(JwtAuthGuard, ApiKeyGuard, AuthorizationGuard)
export class MovimientoInventarioController {
  constructor(private readonly movimientoInventarioService: MovimientoInventarioService) { }

  @RequirePermissions(PERMISOS.MOVIMIENTO_INVENTARIO_CREAR)
  @Post()
  create(@Body() createAreaDto: CreateMovimientoInventarioDto) {
    return this.movimientoInventarioService.create(createAreaDto);
  }

  @RequirePermissions(PERMISOS.MOVIMIENTO_INVENTARIO_VER)
  @Get()
  findAll(
    @Query('limit') take: number,
    @Query('skip') skip: number,
    @Query('filter') filter: string,
    @Query('order') order: string,

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

    return this.movimientoInventarioService.findAll(options);
  }

  @RequirePermissions(PERMISOS.MOVIMIENTO_INVENTARIO_VER)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.movimientoInventarioService.findOne(id);
  }

  @RequirePermissions(PERMISOS.MOVIMIENTO_INVENTARIO_EDITAR)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateAreaDto: UpdateMovimientoInventarioDto) {
    return this.movimientoInventarioService.update(id, updateAreaDto);
  }

  @RequirePermissions(PERMISOS.MOVIMIENTO_INVENTARIO_ELIMINAR)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.movimientoInventarioService.remove(id);
  }

  @RequirePermissions(PERMISOS.MOVIMIENTO_INVENTARIO_CREAR)
  @Post('egreso-masivo')
  egresoMasivo(@Body() egresoMasivoDto: EgresoMasivoDto) {
    return this.movimientoInventarioService.egresoMasivo(egresoMasivoDto);
  }
}
