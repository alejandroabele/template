import { ROLE_ADMIN, ROLE_SUPERADMIN, ROLE_VENDEDOR, ROLE_ADMIN_VENTAS, ROLE_ALMACEN, ROLE_COSTEO, ROLE_COSTEO_COMERCIAL, ROLE_PRODUCCION, ROLE_SERVICIO, ROLE_DISENADOR, ROLE_FACTURACION } from '@/constants/roles';
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { Role } from '../auth/decorators/role/role.decorator';
import { ApiKeyGuard } from '../auth/guards/api-key/api-key.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { PermissionGuard } from '../auth/guards/permission/permission.guard';
import { ProveedorRubroService } from './proveedor-rubro.service';
import { CreateProveedorRubroDto } from './dto/create-proveedor-rubro.dto';
import { UpdateProveedorRubroDto } from './dto/update-proveedor-rubro.dto';
import { PERMISOS } from '@/constants/permisos';
import { AuthorizationGuard } from '../auth/guards/authorization/authorization.guard';
import { RequirePermissions } from '../auth/decorators/require-permissions/require-permissions.decorator';




@Controller('proveedor-rubro')
@UseGuards(JwtAuthGuard, ApiKeyGuard, AuthorizationGuard)
export class ProveedorRubroController {
  constructor(private readonly areaService: ProveedorRubroService) { }

  @RequirePermissions(PERMISOS.PROVEEDORES_RUBRO_CREAR)
  @Post()
  create(@Body() createAreaDto: CreateProveedorRubroDto) {
    return this.areaService.create(createAreaDto);
  }

  @RequirePermissions(PERMISOS.PROVEEDORES_RUBRO_VER)
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

  @RequirePermissions(PERMISOS.PROVEEDORES_RUBRO_VER)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.areaService.findOne(id);
  }

  @RequirePermissions(PERMISOS.PROVEEDORES_RUBRO_EDITAR)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateAreaDto: UpdateProveedorRubroDto) {
    return this.areaService.update(id, updateAreaDto);
  }

  @RequirePermissions(PERMISOS.PROVEEDORES_RUBRO_ELIMINAR)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.areaService.remove(id);
  }
}
