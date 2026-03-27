import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { AlquilerPrecioService } from './alquiler-precio.service';
import { CreateAlquilerPrecioDto } from './dto/create-alquiler-precio.dto';
import { UpdateAlquilerPrecioDto } from './dto/update-alquiler-precio.dto';
import { ApiKeyGuard } from '../auth/guards/api-key/api-key.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { AuthorizationGuard } from '../auth/guards/authorization/authorization.guard';
import { RequirePermissions } from '../auth/decorators/require-permissions/require-permissions.decorator';
import { PERMISOS } from '@/constants/permisos';

@Controller('alquiler-precio')
@UseGuards(JwtAuthGuard, ApiKeyGuard, AuthorizationGuard)
export class AlquilerPrecioController {
  constructor(private readonly alquilerPrecioService: AlquilerPrecioService) { }

  @RequirePermissions(PERMISOS.ALQUILERES_PRECIO_CREAR)
  @Post()
  create(@Body() createAlquilerPrecioDto: CreateAlquilerPrecioDto) {
    return this.alquilerPrecioService.create(createAlquilerPrecioDto);
  }

  @RequirePermissions(PERMISOS.ALQUILERES_PRECIO_VER)
  @Get()
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
    return this.alquilerPrecioService.findAll(options);
  }

  @RequirePermissions(PERMISOS.ALQUILERES_PRECIO_VER)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.alquilerPrecioService.findOne(+id);
  }

  @RequirePermissions(PERMISOS.ALQUILERES_PRECIO_EDITAR)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAlquilerPrecioDto: UpdateAlquilerPrecioDto) {
    return this.alquilerPrecioService.update(+id, updateAlquilerPrecioDto);
  }

  @RequirePermissions(PERMISOS.ALQUILERES_PRECIO_ELIMINAR)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.alquilerPrecioService.remove(+id);
  }
}
