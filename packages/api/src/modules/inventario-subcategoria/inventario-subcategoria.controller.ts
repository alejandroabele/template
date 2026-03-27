import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiKeyGuard } from '@/modules/auth/guards/api-key/api-key.guard';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth/jwt-auth.guard';
import { PermissionGuard } from '@/modules/auth/guards/permission/permission.guard';
import { InventarioSubcategoriaService } from './inventario-subcategoria.service';
import { CreateInventarioSubcategoriaDto } from './dto/create-inventario-subcategoria.dto';
import { UpdateInventarioSubcategoriaDto } from './dto/update-inventario-subcategoria.dto';
import { PERMISOS } from '@/constants/permisos';
import { AuthorizationGuard } from '../auth/guards/authorization/authorization.guard';
import { RequirePermissions } from '../auth/decorators/require-permissions/require-permissions.decorator';



@Controller('inventario-subcategoria')
@UseGuards(JwtAuthGuard, ApiKeyGuard, AuthorizationGuard)
export class InventarioSubcategoriaController {
  constructor(private readonly subcategoriaService: InventarioSubcategoriaService) { }

  @RequirePermissions(PERMISOS.INVENTARIO_CATEGORIA_CREAR)
  @Post()
  create(@Body() createSubcategoriaDto: CreateInventarioSubcategoriaDto) {
    return this.subcategoriaService.create(createSubcategoriaDto);
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
    const orderBy = order ? JSON.parse(order) : {};
    const options = {
      where,
      order: orderBy,
      take,
      skip,
    };
    return this.subcategoriaService.findAll(options);
  }

  @RequirePermissions(PERMISOS.INVENTARIO_CATEGORIA_VER)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.subcategoriaService.findOne(id);
  }

  @RequirePermissions(PERMISOS.INVENTARIO_CATEGORIA_EDITAR)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateSubcategoriaDto: UpdateInventarioSubcategoriaDto) {
    return this.subcategoriaService.update(id, updateSubcategoriaDto);
  }

  @RequirePermissions(PERMISOS.INVENTARIO_CATEGORIA_ELIMINAR)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.subcategoriaService.remove(id);
  }
}
