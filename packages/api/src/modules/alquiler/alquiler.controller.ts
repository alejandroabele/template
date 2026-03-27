import { Controller, Get, Post, Put, Delete, Param, Body, Query, Patch, Res, UseGuards } from '@nestjs/common';
import { AlquilerService } from './alquiler.service';
import { AlquilerReportesService } from './alquiler-reportes.service';
import { CreateAlquilerDto } from './dto/create-alquiler.dto';
import { UpdateAlquilerDto } from './dto/update-alquiler.dto';
import { Response } from 'express'; // Importar Response desde 'express'
import { ExcelExportService } from '@/services/excel-export/excel-export.service'
import { ApiKeyGuard } from '../auth/guards/api-key/api-key.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { AuthorizationGuard } from '../auth/guards/authorization/authorization.guard';
import { RequirePermissions } from '../auth/decorators/require-permissions/require-permissions.decorator';
import { PERMISOS } from '@/constants/permisos';

@Controller('alquiler')
export class AlquilerController {
  constructor(
    private readonly alquilerService: AlquilerService,
    private readonly excelExportService: ExcelExportService,
    private readonly alquilerReportesService: AlquilerReportesService,

    // Inyectamos el servicio para generar el Excel
  ) { }

  @RequirePermissions(PERMISOS.ALQUILERES_CREAR)
  @UseGuards(JwtAuthGuard, ApiKeyGuard, AuthorizationGuard)
  @Post()
  create(@Body() createAlquilerDto: CreateAlquilerDto) {
    return this.alquilerService.create(createAlquilerDto);
  }

  @RequirePermissions(PERMISOS.ALQUILERES_VER)
  @UseGuards(JwtAuthGuard, ApiKeyGuard, AuthorizationGuard)
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
    return this.alquilerService.findAll(options);
  }
  @RequirePermissions(PERMISOS.ALQUILERES_VER)
  @UseGuards(JwtAuthGuard, ApiKeyGuard, AuthorizationGuard)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.alquilerService.findOne(id);
  }

  @RequirePermissions(PERMISOS.ALQUILERES_EDITAR)
  @UseGuards(JwtAuthGuard, ApiKeyGuard, AuthorizationGuard)
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateAlquilerDto: UpdateAlquilerDto) {
    return this.alquilerService.update(id, updateAlquilerDto);
  }


  @RequirePermissions(PERMISOS.ALQUILERES_PRECIO_CREAR)
  @UseGuards(JwtAuthGuard, ApiKeyGuard, AuthorizationGuard)
  @Patch(':id/precio')
  updatePrice(@Param('id') id: number, @Body() updateAlquilerDto: UpdateAlquilerDto) {
    return this.alquilerService.updatePrice(id, updateAlquilerDto);
  }


  @RequirePermissions(PERMISOS.ALQUILERES_ELIMINAR)
  @UseGuards(JwtAuthGuard, ApiKeyGuard, AuthorizationGuard)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.alquilerService.remove(id);
  }

  @RequirePermissions(PERMISOS.ALQUILERES_EXPORTAR_EXCEL)
  @UseGuards(JwtAuthGuard, ApiKeyGuard, AuthorizationGuard)
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
    const recursos = await this.alquilerService.findAll(options);

    // Procesar los datos para el formato Excel
    const excelData = recursos.map((recurso) => {
      return {
        id: recurso.id,
        codigo: recurso.alquilerRecurso?.codigo,
        proveedor: recurso.alquilerRecurso?.proveedor,
        tipo: recurso.alquilerRecurso?.tipo,
        localidad: recurso.localidad,
        zona: recurso.zona,
        estado: recurso.estado,
        cliente: recurso.cliente?.nombre,
        estadoFacturacion: recurso.estadoFacturacion,
        estadoCobranza: recurso.estadoCobranza,
        inicioContrato: recurso.inicioContrato,
        vencimientoContrato: recurso.vencimientoContrato,
        precio: recurso.precio,
        fechaLimiteNegociacion: recurso.fechaLimiteNegociacion,
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

  @RequirePermissions(PERMISOS.ALQUILERES_REPORTE_FACTURACION)
  @UseGuards(JwtAuthGuard, ApiKeyGuard, AuthorizationGuard)
  @Get('facturacion-cobranza')
  async getFacturacionYCobranzaUltimos6Meses() {
    return this.alquilerReportesService.getFacturacionYCobranza();
  }
  @RequirePermissions(PERMISOS.ALQUILERES_REPORTE_CANTIDAD_RECURSOS)
  @UseGuards(JwtAuthGuard, ApiKeyGuard, AuthorizationGuard)
  @Get('cantidad-recursos-tipo')
  async getCantidadRecursosPorTipo() {
    return this.alquilerReportesService.getCantidadRecursosPorTipo();
  }
  @RequirePermissions(PERMISOS.ALQUILERES_REPORTE_ESTADO_RECURSOS)
  @UseGuards(JwtAuthGuard, ApiKeyGuard, AuthorizationGuard)
  @Get('cantidad-recursos-estado')
  async getCantidadRecursosPorEstado() {
    return this.alquilerReportesService.getCantidadRecursosPorEstado();
  }
}
