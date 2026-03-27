import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res, UseGuards } from '@nestjs/common';
import { AlquilerRecursoService } from './alquiler-recurso.service';
import { CreateAlquileRecursorDto } from './dto/create-alquiler-recurso.dto';
import { UpdateAlquilerRecursoDto } from './dto/update-alquiler-recurso.dto';
import { ExcelExportService } from '@/services/excel-export/excel-export.service'
import { Response } from 'express'; // Importar Response desde 'express'
import { ApiKeyGuard } from '../auth/guards/api-key/api-key.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { AuthorizationGuard } from '../auth/guards/authorization/authorization.guard';
import { PERMISOS } from '@/constants/permisos';
import { RequirePermissions } from '../auth/decorators/require-permissions/require-permissions.decorator';




@UseGuards(JwtAuthGuard, ApiKeyGuard, AuthorizationGuard)
@Controller('alquiler-recurso')
export class AlquilerRecursoController {
  constructor(
    private readonly alquilerRecursoService: AlquilerRecursoService,
    private readonly excelExportService: ExcelExportService,  // Inyectamos el servicio para generar el Excel
  ) { }

  @RequirePermissions(PERMISOS.ALQUILERES_RECURSOS_CREAR)
  @Post()
  create(@Body() createAlquilerRecursoDto: CreateAlquileRecursorDto) {
    return this.alquilerRecursoService.create(createAlquilerRecursoDto);
  }

  @RequirePermissions(PERMISOS.ALQUILERES_RECURSOS_VER)
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
    return this.alquilerRecursoService.findAll(options);
  }


  @RequirePermissions(PERMISOS.ALQUILERES_RECURSOS_VER)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.alquilerRecursoService.findOne(+id);
  }

  @RequirePermissions(PERMISOS.ALQUILERES_RECURSOS_EDITAR)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAlquilerRecursoDto: UpdateAlquilerRecursoDto) {
    return this.alquilerRecursoService.update(+id, updateAlquilerRecursoDto);
  }

  @RequirePermissions(PERMISOS.ALQUILERES_RECURSOS_ELIMINAR)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.alquilerRecursoService.remove(+id);
  }

  @RequirePermissions(PERMISOS.ALQUILERES_RECURSOS_EXCEL)
  @Get('excel')
  async exportToExcel(
    @Query('limit') take: number,
    @Query('skip') skip: number,
    @Query('filter') filter: string,
    @Query('order') order: string,
    @Res() response: Response,  // Usamos la respuesta de express
  ) {
    const where = filter ? JSON.parse(filter) : [];
    const orderBy = order ? JSON.parse(order) : {};

    const options = {
      where,
      order: orderBy,
      take: Number.MAX_SAFE_INTEGER,
      skip,
    };
    // Obtener los datos desde el servicio
    const recursos = await this.alquilerRecursoService.findAll(options);

    // Procesar los datos para el formato Excel
    const excelData = recursos.map((recurso) => {
      return {
        id: recurso.id,
        codigo: recurso.codigo,
        proveedor: recurso.proveedor,
        tipo: recurso.tipo,
        precio: recurso.precio,
        estado: recurso.estado,
        inicioContratoSubAlquiler: recurso.inicioContratoSubAlquiler,
        vencimientoContratoSubAlquiler: recurso.vencimientoContratoSubAlquiler,
      };
    });

    // Generar el archivo Excel como buffer
    const fileBuffer = await this.excelExportService.generarExcel('recurso_data', excelData);

    // Configurar los encabezados de la respuesta
    response.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    response.header('Content-Disposition', 'attachment; filename="recurso_data.xlsx"');

    // Enviar el buffer como respuesta
    response.send(fileBuffer);
  }

}
