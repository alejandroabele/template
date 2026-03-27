import { ROLE_ADMIN, ROLE_SUPERADMIN, ROLE_VENDEDOR, ROLE_ADMIN_VENTAS, ROLE_ALMACEN, ROLE_COSTEO, ROLE_COSTEO_COMERCIAL, ROLE_PRODUCCION, ROLE_SERVICIO, ROLE_DISENADOR, ROLE_FACTURACION } from '@/constants/roles';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, Res, ParseIntPipe } from '@nestjs/common';
import { Role } from '../auth/decorators/role/role.decorator';
import { ApiKeyGuard } from '../auth/guards/api-key/api-key.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { PermissionGuard } from '../auth/guards/permission/permission.guard';
import { ProveedorService } from './proveedor.service';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { UpdateProveedorDto } from './dto/update-proveedor.dto';
import { Response } from 'express'; // Importar Response desde 'express'
import { ExcelExportService } from '@/services/excel-export/excel-export.service';

import { PERMISOS } from '@/constants/permisos';
import { AuthorizationGuard } from '../auth/guards/authorization/authorization.guard';
import { RequirePermissions } from '../auth/decorators/require-permissions/require-permissions.decorator';



@Controller('proveedor')
@UseGuards(JwtAuthGuard, ApiKeyGuard, AuthorizationGuard)
export class ProveedorController {
  constructor(
    private readonly areaService: ProveedorService,
    private readonly excelExportService: ExcelExportService,  // Inyectamos el servicio para generar el Excel
  ) { }

  @RequirePermissions(PERMISOS.PROVEEDORES_CREAR)
  @Post()
  create(@Body() createAreaDto: CreateProveedorDto) {
    return this.areaService.create(createAreaDto);
  }

  @RequirePermissions(PERMISOS.PROVEEDORES_VER)
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

  @RequirePermissions(PERMISOS.PROVEEDORES_VER)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.areaService.findOne(id);
  }

  @RequirePermissions(PERMISOS.PROVEEDORES_VER)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateAreaDto: UpdateProveedorDto) {
    return this.areaService.update(id, updateAreaDto);
  }

  @RequirePermissions(PERMISOS.PROVEEDORES_ELIMINAR)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.areaService.remove(id);
  }

  @Get('excel')
  @RequirePermissions(PERMISOS.PROVEEDORES_VER)
  async exportToExcel(
    @Query('limit') take: number,
    @Query('skip') skip: number,
    @Query('filter') filter: string,
    @Query('order') order: string,
    @Query('columns') columns: string,
    @Res() response: Response,  // Usamos la respuesta de express
  ) {
    const where = filter ? JSON.parse(filter) : [];
    const orderBy = order ? JSON.parse(order) : {};
    const showColumns = columns ? Object.keys(JSON.parse(columns)).filter(key => JSON.parse(columns)[key]) : [];
    const options = {
      where,
      order: orderBy,
      take: Number.MAX_SAFE_INTEGER,
      skip,
    };
    // Obtener los datos desde el servicio
    const presupuestos = await this.areaService.findAll(options);
    function getNestedValue(obj: any, path: string) {
      return path.split('.').reduce((acc, part) => acc ? acc[part] : undefined, obj);
    }
    // Procesar los datos para el formato Excel
    const excelData = presupuestos.map((presupuesto) => {
      const filteredData: Record<string, any> = {};

      showColumns.forEach((key) => {
        // Obtener el valor para cada clave, considerando que algunas pueden ser anidadas
        filteredData[key] = getNestedValue(presupuesto, key);
      });

      return filteredData;
    });

    // Generar el archivo Excel como buffer
    const fileBuffer = await this.excelExportService.generarExcel('proveedores', excelData);

    // // Configurar los encabezados de la respuesta
    response.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    response.header('Content-Disposition', 'attachment; filename="recurso_data.xlsx"');

    // // Enviar el buffer como respuesta
    response.send(fileBuffer);
  }
}
