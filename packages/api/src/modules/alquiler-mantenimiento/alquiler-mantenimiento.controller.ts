import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { AlquilerMantenimientoService } from './alquiler-mantenimiento.service';
import { CreateAlquilerMantenimientoDto } from './dto/create-alquiler-mantenimiento.dto';
import { UpdateAlquilerMantenimientoDto } from './dto/update-alquiler-mantenimiento.dto';
import { ApiKeyGuard } from '../auth/guards/api-key/api-key.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { AuthorizationGuard } from '../auth/guards/authorization/authorization.guard';
import { RequirePermissions } from '../auth/decorators/require-permissions/require-permissions.decorator';
import { PERMISOS } from '@/constants/permisos';

@Controller('alquiler-mantenimiento')
@UseGuards(JwtAuthGuard, ApiKeyGuard, AuthorizationGuard)
export class AlquilerMantenimientoController {
  constructor(private readonly alquilerMantenimientoService: AlquilerMantenimientoService) { }

  @Post()
  @RequirePermissions(PERMISOS.ALQUILERES_MANTENIMIENTO_CREAR)
  create(@Body() createAlquilerMantenimientoDto: CreateAlquilerMantenimientoDto) {
    return this.alquilerMantenimientoService.create(createAlquilerMantenimientoDto);
  }

  @Get()
  @RequirePermissions(PERMISOS.ALQUILERES_MANTENIMIENTO_VER)
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
    return this.alquilerMantenimientoService.findAll(options);
  }


  @Get(':id')
  @RequirePermissions(PERMISOS.ALQUILERES_MANTENIMIENTO_VER)
  findOne(@Param('id') id: string) {
    return this.alquilerMantenimientoService.findOne(+id);
  }

  @Patch(':id')
  @RequirePermissions(PERMISOS.ALQUILERES_MANTENIMIENTO_EDITAR)
  update(@Param('id') id: string, @Body() updateAlquilerMantenimientoDto: UpdateAlquilerMantenimientoDto) {
    return this.alquilerMantenimientoService.update(+id, updateAlquilerMantenimientoDto);
  }

  @Delete(':id')
  @RequirePermissions(PERMISOS.ALQUILERES_MANTENIMIENTO_ELIMINAR)
  remove(@Param('id') id: string) {
    return this.alquilerMantenimientoService.remove(+id);
  }
}
