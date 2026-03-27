import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiKeyGuard } from '../auth/guards/api-key/api-key.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { InventarioConversionService } from './inventario-conversion.service';
import { CreateInventarioConversionDto } from './dto/create-inventario-conversion.dto';
import { UpdateInventarioConversionDto } from './dto/update-inventario-conversion.dto';
import { PERMISOS } from '@/constants/permisos';
import { AuthorizationGuard } from '../auth/guards/authorization/authorization.guard';
import { RequirePermissions } from '../auth/decorators/require-permissions/require-permissions.decorator';

@Controller('inventario-conversion')
@UseGuards(JwtAuthGuard, ApiKeyGuard, AuthorizationGuard)

export class InventarioConversionController {
  constructor(private readonly conversionService: InventarioConversionService) { }

  @Post()
  @RequirePermissions(PERMISOS.INVENTARIO_CREAR)
  create(@Body() createConversionDto: CreateInventarioConversionDto) {
    return this.conversionService.create(createConversionDto);
  }

  @Get()
  @RequirePermissions(PERMISOS.INVENTARIO_VER)
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
    return this.conversionService.findAll(options);
  }

  @Get(':id')
  @RequirePermissions(PERMISOS.INVENTARIO_VER)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.conversionService.findOne(id);
  }

  @Patch(':id')
  @RequirePermissions(PERMISOS.INVENTARIO_EDITAR)
  update(@Param('id', ParseIntPipe) id: number, @Body() updateConversionDto: UpdateInventarioConversionDto) {
    return this.conversionService.update(id, updateConversionDto);
  }

  @Delete(':id')
  @RequirePermissions(PERMISOS.INVENTARIO_ELIMINAR)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.conversionService.remove(id);
  }
}
