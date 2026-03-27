import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiKeyGuard } from '../auth/guards/api-key/api-key.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { PlazoPagoService } from './plazo-pago.service';
import { CreatePlazoPagoDto } from './dto/create-plazo-pago.dto';
import { UpdatePlazoPagoDto } from './dto/update-plazo-pago.dto';
import { PERMISOS } from '@/constants/permisos';
import { AuthorizationGuard } from '../auth/guards/authorization/authorization.guard';
import { RequirePermissions } from '../auth/decorators/require-permissions/require-permissions.decorator';

@Controller('plazo-pago')
@UseGuards(JwtAuthGuard, ApiKeyGuard, AuthorizationGuard)
export class PlazoPagoController {
  constructor(private readonly plazoPagoService: PlazoPagoService) { }

  @RequirePermissions(PERMISOS.PLAZO_PAGO_CREAR)
  @Post()
  create(@Body() createPlazoPagoDto: CreatePlazoPagoDto) {
    return this.plazoPagoService.create(createPlazoPagoDto);
  }

  @RequirePermissions(PERMISOS.PLAZO_PAGO_VER)
  @Get()
  findAll(
    @Query('limit') take: number,
    @Query('skip') skip: number,
    @Query('filter') filter: string,
    @Query('order') order: string,
  ) {
    const where = filter ? JSON.parse(filter) : [];
    const orderBy = order ? JSON.parse(order) : {};

    const options = {
      where,
      order: orderBy,
      take,
      skip,
    };

    return this.plazoPagoService.findAll(options);
  }

  @RequirePermissions(PERMISOS.PLAZO_PAGO_VER)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.plazoPagoService.findOne(id);
  }

  @RequirePermissions(PERMISOS.PLAZO_PAGO_EDITAR)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updatePlazoPagoDto: UpdatePlazoPagoDto) {
    return this.plazoPagoService.update(id, updatePlazoPagoDto);
  }

  @RequirePermissions(PERMISOS.PLAZO_PAGO_ELIMINAR)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.plazoPagoService.remove(id);
  }
}
