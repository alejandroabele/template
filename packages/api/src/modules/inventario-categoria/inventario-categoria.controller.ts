import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiKeyGuard } from '../auth/guards/api-key/api-key.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { InventarioCategoriaService } from './inventario-categoria.service';
import { CreateInventarioCategoriaDto } from './dto/create-inventario-categoria.dto';
import { UpdateInventarioCategoriaDto } from './dto/update-inventario-categoria.dto';
import { PERMISOS } from '@/constants/permisos';
import { AuthorizationGuard } from '../auth/guards/authorization/authorization.guard';
import { RequirePermissions } from '../auth/decorators/require-permissions/require-permissions.decorator';

@Controller('inventario-categoria')
@UseGuards(JwtAuthGuard, ApiKeyGuard, AuthorizationGuard)
export class InventarioCategoriaController {
  constructor(private readonly categoriaService: InventarioCategoriaService) { }
  @RequirePermissions(PERMISOS.INVENTARIO_CATEGORIA_CREAR)
  @Post()
  create(@Body() createCategoriaDto: CreateInventarioCategoriaDto) {
    return this.categoriaService.create(createCategoriaDto);
  }
  @RequirePermissions(PERMISOS.INVENTARIO_CATEGORIA_VER)
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
    return this.categoriaService.findAll(options);
  }
  @RequirePermissions(PERMISOS.INVENTARIO_CATEGORIA_VER)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoriaService.findOne(id);
  }
  @RequirePermissions(PERMISOS.INVENTARIO_CATEGORIA_EDITAR)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateCategoriaDto: UpdateInventarioCategoriaDto) {
    return this.categoriaService.update(id, updateCategoriaDto);
  }
  @RequirePermissions(PERMISOS.INVENTARIO_CATEGORIA_ELIMINAR)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoriaService.remove(id);
  }
}
