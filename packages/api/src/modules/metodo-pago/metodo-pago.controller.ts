import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiKeyGuard } from '../auth/guards/api-key/api-key.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { MetodoPagoService } from './metodo-pago.service';
import { CreateMetodoPagoDto } from './dto/create-metodo-pago.dto';
import { UpdateMetodoPagoDto } from './dto/update-metodo-pago.dto';
import { PERMISOS } from '@/constants/permisos';
import { AuthorizationGuard } from '../auth/guards/authorization/authorization.guard';
import { RequirePermissions } from '../auth/decorators/require-permissions/require-permissions.decorator';



@Controller('metodo-pago')
@UseGuards(JwtAuthGuard, ApiKeyGuard, AuthorizationGuard)
export class MetodoPagoController {
  constructor(private readonly areaService: MetodoPagoService) { }

  @RequirePermissions(PERMISOS.METODO_PAGO_CREAR)
  @Post()
  create(@Body() createAreaDto: CreateMetodoPagoDto) {
    return this.areaService.create(createAreaDto);
  }

  @RequirePermissions(PERMISOS.METODO_PAGO_VER)
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

    return this.areaService.findAll(options);
  }

  @RequirePermissions(PERMISOS.METODO_PAGO_VER)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.areaService.findOne(id);
  }

  @RequirePermissions(PERMISOS.METODO_PAGO_EDITAR)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateAreaDto: UpdateMetodoPagoDto) {
    return this.areaService.update(id, updateAreaDto);
  }

  @RequirePermissions(PERMISOS.METODO_PAGO_ELIMINAR)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.areaService.remove(id);
  }
}
