import { PERMISOS } from '@/constants/permisos';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, Res } from '@nestjs/common';
import { RequirePermissions } from '../auth/decorators/require-permissions/require-permissions.decorator';
import { ApiKeyGuard } from '../auth/guards/api-key/api-key.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { AuthorizationGuard } from '../auth/guards/authorization/authorization.guard';
import { PresupuestoService } from './presupuesto.service';
import { PresupuestoReportesService } from './presupuesto-reportes.service';
import { CreatePresupuestoDto } from './dto/create-presupuesto.dto';
import { UpdatePresupuestoDto } from './dto/update-presupuesto.dto';
import { ExcelExportService } from '@/services/excel-export/excel-export.service'
import { PdfExportService } from '@/services/pdf-export/pdf-export.service'
import { ArchivoService } from '@/modules/archivo/archivo.service'
import { Response } from 'express'; // Importar Response desde 'express'
import { formatDate, getToday } from '@/helpers/date';
import { UpdateFechaDto } from './dto/update-fecha.dto';
import { PRESUPUESTO_EXCEL_HEADER_MAP } from '@/constants/presupuesto'; // Importar las constantes de presupuesto para su uso
import { PROCESO_GENERAL } from '@/constants/proceso-general';
import { AuditoriaService } from '@/modules/auditoria/auditoria.service';
import { hasPermission } from '@/helpers/has-permissions.helper';

@Controller('presupuesto')
@UseGuards(JwtAuthGuard, ApiKeyGuard, AuthorizationGuard)
export class PresupuestoController {
  constructor(
    private readonly presupuestoService: PresupuestoService,
    private readonly presupuestoReportesService: PresupuestoReportesService,
    private readonly excelExportService: ExcelExportService,  // Inyectamos el servicio para generar el Excel
    private readonly pdfExportService: PdfExportService,  // Inyectamos el servicio para generar el PDF
    private readonly archivoService: ArchivoService,  // Inyectamos el servicio para manejar archivos
    private readonly auditoriaService: AuditoriaService,  // Inyectamos el servicio de auditoría
  ) { }

  @RequirePermissions(PERMISOS.PRESUPUESTOS_CREAR)
  @Post()
  create(@Body() createPresupuestoDto: CreatePresupuestoDto) {
    return this.presupuestoService.create(createPresupuestoDto);
  }



  @RequirePermissions(PERMISOS.PRESUPUESTOS_VER)
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
    return this.presupuestoService.findAll(options);
  }

  @RequirePermissions(PERMISOS.PRESUPUESTOS_LISTAR)
  @Get('listar')
  listar(
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
    return this.presupuestoService.listar(options);
  }


  @RequirePermissions(PERMISOS.PRESUPUESTOS_VER)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.presupuestoService.findOne(+id);
  }

  @RequirePermissions(PERMISOS.PRESUPUESTOS_EDITAR)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePresupuestoDto: UpdatePresupuestoDto) {
    return this.presupuestoService.update(+id, updatePresupuestoDto);
  }
  @RequirePermissions(PERMISOS.PRESUPUESTOS_VERIFICAR_ALMACEN)
  @Patch(':id/verificar-almacen')
  verificarAlmacen(@Param('id') id: string, @Body() updatePresupuestoDto: UpdatePresupuestoDto) {
    return this.presupuestoService.verificarAlmacen(+id, updatePresupuestoDto);
  }

  @RequirePermissions(PERMISOS.PRESUPUESTOS_APROBAR_SERVICIO)
  @Patch(':id/verificar-servicio')
  verificarServicio(@Param('id') id: string, @Body() updatePresupuestoDto: UpdatePresupuestoDto) {
    return this.presupuestoService.verificarServicio(+id, updatePresupuestoDto);
  }



  //TODO: Separar en dos endpoints distintos y unificar el servidio de PRESUPUESTOS_ACTUALIZAR_FECHA_FABRICACION
  @RequirePermissions(PERMISOS.PRESUPUESTOS_REGISTRAR_FECHA)
  @Patch(':id/fecha')
  registrarFecha(@Param('id') id: string, @Body() updatePresupuestoDto: UpdateFechaDto) {
    return this.presupuestoService.registrarFecha(+id, updatePresupuestoDto);
  }

  @RequirePermissions(PERMISOS.PRESUPUESTOS_CONFIRMAR_ENTREGA)
  @Patch(':id/confirmar-entrega')
  confirmarEntrega(@Param('id') id: string, @Body() updatePresupuestoDto: UpdateFechaDto) {
    return this.presupuestoService.confirmarEntrega(+id, updatePresupuestoDto);
  }
  @RequirePermissions(PERMISOS.PRESUPUESTOS_CERTIFICAR)
  @Patch(':id/certificar')
  certificar(@Param('id') id: string, @Body() updatePresupuestoDto: UpdateFechaDto) {
    return this.presupuestoService.certificar(+id, updatePresupuestoDto);
  }
  @RequirePermissions(PERMISOS.PRESUPUESTOS_ELIMINAR)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.presupuestoService.remove(+id);
  }

  @RequirePermissions(PERMISOS.PRESUPUESTOS_DASHBOARD)
  @Get('ventas-semanales')
  async getVentasSemanales(
    @Query('mes') mes: string,
    @Query('anio') anio: string,
    @Query('procesos') procesos?: string,
    @Query('campoFecha') campoFecha?: string,
  ) {
    const procesosGenerales = procesos ? procesos.split(',').map(Number) : undefined;
    return this.presupuestoReportesService.getVentasSemanales(Number(anio), Number(mes), campoFecha || 'fechaFabricacionEstimada', procesosGenerales);
  }

  @RequirePermissions(PERMISOS.PRESUPUESTOS_DASHBOARD)
  @Get('ventas-por-cliente')
  async getVentasPorCliente(
    @Query('semana') semana: string,
    @Query('mes') mes: string,
    @Query('anio') anio: string,
    @Query('procesos') procesos?: string,
    @Query('campoFecha') campoFecha?: string,

  ) {
    const procesosGenerales = procesos ? procesos.split(',').map(Number) : undefined;
    return this.presupuestoReportesService.getVentasPorCliente(Number(anio), Number(mes), Number(semana), campoFecha || 'fechaFabricacionEstimada', procesosGenerales);
  }

  @RequirePermissions(PERMISOS.PRESUPUESTOS_DASHBOARD)
  @Get('presupuestos-por-cliente')
  async getPresupuestosPorCliente(
    @Query('semana') semana: string,
    @Query('mes') mes: string,
    @Query('anio') anio: string,
    @Query('clienteId') clienteId: string,
    @Query('procesos') procesos?: string,
    @Query('campoFecha') campoFecha?: string,

  ) {
    const procesosGenerales = procesos ? procesos.split(',').map(Number) : undefined;
    return this.presupuestoReportesService.getPresupuestosPorClienteSemana(Number(anio), Number(mes), Number(semana), Number(clienteId), campoFecha || 'fechaFabricacionEstimada', procesosGenerales);
  }

  @RequirePermissions(PERMISOS.PRESUPUESTOS_DASHBOARD)
  @Get('auditoria-semanales')
  async getAuditoriaSemanales(
    @Query('mes') mes: string,
    @Query('anio') anio: string,
    @Query('procesos') procesos?: string,
    @Query('modo') modo?: 'semanal' | 'mensual',
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('variante') variante?: string,

  ) {
    const procesosGenerales = procesos ? procesos.split(',').map(Number) : [PROCESO_GENERAL.FACTURADO];
    const modoAgrupacion = modo || 'semanal';
    return this.presupuestoReportesService.getPresupuestosPorCambioFecha({
      anio: Number(anio),
      mes: Number(mes),
      procesosGenerales,
      modo: modoAgrupacion,
      from,
      to,
      variante
    });
  }

  @RequirePermissions(PERMISOS.PRESUPUESTOS_DASHBOARD)
  @Get('cantidad-semanales')
  async getCantidadSemanales(
    @Query('mes') mes: string,
    @Query('anio') anio: string,
    @Query('procesos') procesos?: string,
    @Query('modo') modo?: 'semanal' | 'mensual',
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    const procesosGenerales = procesos ? procesos.split(',').map(Number) : [PROCESO_GENERAL.FACTURADO];
    const modoAgrupacion = modo || 'semanal';
    return this.presupuestoReportesService.getCantidadPresupuestosPorCambioFecha({
      anio: Number(anio),
      mes: Number(mes),
      procesosGenerales,
      modo: modoAgrupacion,
      from,
      to
    });
  }

  @RequirePermissions(PERMISOS.PRESUPUESTOS_DASHBOARD)
  @Get('auditoria-semanales-cantidad')
  async getAuditoriaSemanalesCantidad(
    @Query('mes') mes: string,
    @Query('anio') anio: string,
    @Query('procesos') procesos?: string,
    @Query('modo') modo?: 'semanal' | 'mensual',
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    const procesosGenerales = procesos ? procesos.split(',').map(Number) : [PROCESO_GENERAL.FACTURADO];
    const modoAgrupacion = modo || 'semanal';
    return this.presupuestoReportesService.getCantidadPresupuestosPorCambioFecha({
      anio: Number(anio),
      mes: Number(mes),
      procesosGenerales,
      modo: modoAgrupacion,
      from,
      to
    });
  }
  @RequirePermissions(PERMISOS.PRESUPUESTOS_DASHBOARD)
  @Get('auditoria-por-cliente')
  async getAuditoriaPorCliente(
    @Query('semana') semana: string,
    @Query('mes') mes: string,
    @Query('anio') anio: string,
    @Query('procesos') procesos?: string,
    @Query('variante') variante?: string,
  ) {
    const procesosGenerales = procesos ? procesos.split(',').map(Number) : [];
    return this.presupuestoReportesService.getPresupuestosPorCambioFechaPorCliente(Number(anio), Number(mes), Number(semana), procesosGenerales, variante);
  }

  @RequirePermissions(PERMISOS.PRESUPUESTOS_DASHBOARD)
  @Get('presupuestos-auditoria-cliente')
  async getPresupuestosAuditoriaCliente(
    @Query('semana') semana: string,
    @Query('mes') mes: string,
    @Query('anio') anio: string,
    @Query('clienteId') clienteId: string,
    @Query('procesos') procesos?: string,
    @Query('variante') variante?: string,
  ) {
    const procesosGenerales = procesos ? procesos.split(',').map(Number) : [PROCESO_GENERAL.FACTURADO];
    return this.presupuestoReportesService.getPresupuestosClientePorCambioFecha(Number(anio), Number(mes), Number(semana), Number(clienteId), procesosGenerales, variante);
  }

  @RequirePermissions(PERMISOS.PRESUPUESTOS_EXPORTAR_EXCEL)
  @Get('excel')
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
    const columnsObj = columns ? JSON.parse(columns) : {};
    const showColumns = Object.keys(columnsObj).filter((k) => columnsObj[k]);
    const options = {
      where,
      order: orderBy,
      take: Number.MAX_SAFE_INTEGER,
      skip,
    };
    // Obtener los datos desde el servicio
    const presupuestos = await this.presupuestoService.findAll(options);
    function getNestedValue(obj: any, path: string) {
      return path.split('.').reduce((acc, part) => acc ? acc[part] : undefined, obj);
    }
    // Procesar los datos para el formato Excel
    const excelData = presupuestos.map((presupuesto) => {
      const filteredData: Record<string, any> = {};
      showColumns.forEach((key) => {
        const header = PRESUPUESTO_EXCEL_HEADER_MAP[key] ?? key;
        filteredData[header] = getNestedValue(presupuesto, key);
      });
      return filteredData;
    });

    // Generar el archivo Excel como buffer
    const fileBuffer = await this.excelExportService.generarExcel('recurso_data', excelData);

    // // Configurar los encabezados de la respuesta
    response.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    response.header('Content-Disposition', 'attachment; filename="recurso_data.xlsx"');

    // // Enviar el buffer como respuesta
    response.send(fileBuffer);
  }

  @Get(':id/presupuesto/pdf')  // Ruta para generar el PDF
  @RequirePermissions(PERMISOS.PRESUPUESTOS_EXPORTAR_PDF)
  async generatePresupuestoPdf(@Param('id') id: string, @Res() response: Response) {
    // Obtener los datos del presupuesto
    const presupuesto = await this.presupuestoService.findOne(+id);
    if (!presupuesto) {
      response.status(404).send('Presupuesto no encontrado');
      return;
    }

    // Obtener la primera fecha en que el presupuesto pasó a "PROPUESTA_PREPARADA"
    const fecha = await this.auditoriaService.obtenerPrimeraFechaCambioAValor(
      'presupuesto',
      'procesoGeneralId',
      +id,
      PROCESO_GENERAL.PROPUESTA_PREPARADA,
    );
    // Pasamos el nombre del template y los datos al servicio de PDF
    const pdfBuffer = await this.pdfExportService.generatePdf('presupuesto-template', {
      ...presupuesto,
      valorIva: presupuesto.ventaTotal * 0.21,
      valorFinal: presupuesto.ventaTotal * 1.21,
      moneda: presupuesto.moneda || "$",
      fecha: fecha ? formatDate(fecha.split(' ')[0]) : getToday(), //TODO: USAR FORMAT DATE
      appName: process.env.APP_NAME,
      publicUrl: process.env.PUBLIC_URL || 'http://localhost:3000'
    });

    // Configurar los encabezados para la respuesta del PDF
    response.header('Content-Type', 'application/pdf');
    response.header('Content-Disposition', `attachment; filename="presupuesto-${id}.pdf"`);

    response.send(pdfBuffer);
  }
  @Get(':id/orden/pdf')  // Ruta para generar el PDF
  @RequirePermissions(PERMISOS.PRESUPUESTOS_EXPORTAR_ORDEN_PDF)
  async generateOrdenPdf(@Param('id') id: string, @Res() response: Response) {
    const presupuesto = await this.presupuestoService.findOne(+id);
    if (!presupuesto) {
      response.status(404).send('Presupuesto no encontrado');
      return;
    }

    // Procesar items con archivos en base64
    const items = await Promise.all(
      presupuesto.items.map(async (item) => {
        // Procesar trabajos (código existente)
        const procesarTrabajos = (trabajos) => {
          return (trabajos || []).filter(trabajo =>
            (trabajo.materiales?.length > 0) ||
            (trabajo.suministros?.length > 0) ||
            (trabajo.manoDeObra?.length > 0)
          ).map(({ manoDeObra, ...rest }) => rest);
        };

        // Procesar archivo si existe
        let archivoConBase64 = null;
        if (item.archivo?.id) {
          try {
            const fileData = await this.archivoService.getFileBase64(item.archivo.id);
            archivoConBase64 = {
              ...item.archivo,
              base64: fileData.base64
            };
          } catch (error) {
            console.error(`Error procesando archivo ${item.archivo.id}:`, error);
          }
        }
        return {
          cantidad: item.cantidad,
          archivo: archivoConBase64 || item.archivo, // Usa el archivo con base64 si está disponible
          descripcion: item.descripcion,
          observaciones: item.observaciones,
          detalles: item.detalles,
          produccionTrabajos: {
            producto: procesarTrabajos(item.produccionTrabajos?.producto),
            servicio: procesarTrabajos(item.produccionTrabajos?.servicio)
          }
        };
      })
    );
    const puedeVerCostos = await hasPermission(PERMISOS.PRESUPUESTOS_COSTOS_MATERIALES_VER);
    // Generar PDF
    const pdfBuffer = await this.pdfExportService.generatePdf('orden-template', {
      cliente: presupuesto.cliente?.nombre || 'Mantenimiento interno',
      vendedor: presupuesto.vendedor?.nombre || '',
      id: presupuesto.id,
      puedeVerPrecios: puedeVerCostos,
      items,
      fecha: formatDate(presupuesto.fechaVerificacionAlmacen),
      appName: process.env.APP_NAME || 'Pintegralco',
      publicUrl: process.env.PUBLIC_URL || 'http://localhost:3000',
      esMantenimiento: presupuesto.procesoGeneralId === PROCESO_GENERAL.EN_MANTENIMIENTO,
      recurso: presupuesto.alquilerRecurso ? { codigo: presupuesto.alquilerRecurso.codigo, tipo: presupuesto.alquilerRecurso.tipo } : null,
    });

    response.header('Content-Type', 'application/pdf');
    response.header('Content-Disposition', 'attachment; filename="orden.pdf"');
    response.send(pdfBuffer);
  }

  @RequirePermissions(PERMISOS.PRESUPUESTOS_VER_MATERIALES_ANALISIS)
  @Get(':id/materiales-analisis')
  async getMaterialesAnalisis(@Param('id') id: string) {
    return this.presupuestoService.getMaterialesAnalisis(+id);
  }

  @RequirePermissions(PERMISOS.PRESUPUESTOS_VER_SUMINISTROS_ANALISIS)
  @Get(':id/suministros-analisis')
  async getSuministrosAnalisis(@Param('id') id: string) {
    return this.presupuestoService.getSuministrosAnalisis(+id);
  }

  @RequirePermissions(PERMISOS.PRESUPUESTOS_VER_MANO_DE_OBRA_ANALISIS)
  @Get(':id/mano-de-obra-analisis')
  async getManoDeObraAnalisis(@Param('id') id: string) {
    return this.presupuestoService.getManoDeObraAnalisis(+id);
  }

  @RequirePermissions(PERMISOS.PRESUPUESTOS_VER_PRODUCTOS_EXTRAS_ANALISIS)
  @Get(':id/productos-extras-analisis')
  async getProductosExtrasAnalisis(@Param('id') id: string) {
    return this.presupuestoService.getProductosExtrasAnalisis(+id);
  }

}
