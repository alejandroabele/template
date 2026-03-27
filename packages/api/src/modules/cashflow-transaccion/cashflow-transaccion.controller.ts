import { Controller, Get, Post, Body, Param, Delete, Query, UseGuards, ParseBoolPipe, Put, UseInterceptors, UploadedFile, BadRequestException, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CashflowTransaccionService } from './cashflow-transaccion.service';
import { CashflowReportesService } from './cashflow-reportes.service';
import { CreateCashflowTransaccionDto } from './dto/create-cashflow-transaccion.dto';
import { UpdateCashflowTransaccionDto } from './dto/update-cashflow-transaccion.dto';
import { ApiKeyGuard } from '../auth/guards/api-key/api-key.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { FileInterceptor } from '@nest-lab/fastify-multer';
import { File } from '@nest-lab/fastify-multer';

import { PERMISOS } from '@/constants/permisos';
import { RequirePermissions } from '../auth/decorators/require-permissions/require-permissions.decorator';
import { AuthorizationGuard } from '../auth/guards/authorization/authorization.guard';


// Importar las constantes de presupuesto para su uso
@ApiTags('cashflow')
@Controller('cashflow')
@UseGuards(JwtAuthGuard, ApiKeyGuard, AuthorizationGuard)
export class CashflowTransaccionController {
  constructor(
    private readonly cashflowTransaccionService: CashflowTransaccionService,
    private readonly cashflowReportesService: CashflowReportesService
  ) { }
  @Post('transacciones')
  @RequirePermissions(PERMISOS.CASHFLOW_CREAR)
  @ApiOperation({ summary: 'Crear nueva transacción de cashflow' })
  create(@Body() createCashflowTransaccionDto: CreateCashflowTransaccionDto) {
    return this.cashflowTransaccionService.create(createCashflowTransaccionDto);
  }

  @Post('migrar-excel')
  @RequirePermissions(PERMISOS.CASHFLOW_CREAR)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Migrar transacciones desde Excel' })
  async migrarDesdeExcel(@UploadedFile() file: File) {
    if (!file) {
      throw new BadRequestException('No se ha proporcionado ningún archivo');
    }

    if (!file.originalname.match(/\.(xlsx|xls)$/)) {
      throw new BadRequestException('El archivo debe ser un Excel (.xlsx o .xls)');
    }

    try {
      return await this.cashflowTransaccionService.migrarTransaccionesExcel(file.buffer);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('transacciones/busqueda')
  @RequirePermissions(PERMISOS.CASHFLOW_VER)
  @ApiOperation({ summary: 'Buscar transacciones por descripción' })
  @ApiQuery({ name: 'filter', required: false, description: 'Filtros JSON (ej: {"descripcion":"texto"})' })
  @ApiQuery({ name: 'order', required: false, description: 'Ordenamiento JSON (ej: {"fecha":"DESC"})' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  buscarTransacciones(
    @Query('filter') filter?: string,
    @Query('order') order?: string,
    @Query('limit') limit?: number,
    @Query('skip') skip?: number,
  ) {
    const where = filter ? JSON.parse(filter) : {};
    const orderBy = order ? JSON.parse(order) : {};
    return this.cashflowTransaccionService.findBusqueda({
      where,
      order: orderBy,
      take: limit,
      skip,
    });
  }

  @Get('transacciones')
  @RequirePermissions(PERMISOS.CASHFLOW_VER)
  @ApiOperation({ summary: 'Obtener transacciones por rango de fechas' })
  @ApiQuery({ name: 'from', required: false, description: 'Fecha desde (YYYY-MM-DD)' })
  @ApiQuery({ name: 'to', required: false, description: 'Fecha hasta (YYYY-MM-DD)' })
  findTransacciones(
    @Query('from') from?: string,
    @Query('to') to?: string
  ) {
    if (from && to) {
      return this.cashflowTransaccionService.findByDateRange(from, to);
    }
    return this.cashflowTransaccionService.findAll();
  }
  @RequirePermissions(PERMISOS.CASHFLOW_VER)
  @Get('transacciones/:id')
  @ApiOperation({ summary: 'Obtener transacción por ID' })
  findOne(@Param('id') id: string) {
    return this.cashflowTransaccionService.findOne(+id);
  }

  @RequirePermissions(PERMISOS.CASHFLOW_CATEGORIA_EDITAR)
  @Put('transacciones/:id')
  @ApiOperation({ summary: 'Actualizar transacción' })
  update(@Param('id') id: string, @Body() updateCashflowTransaccionDto: UpdateCashflowTransaccionDto) {
    return this.cashflowTransaccionService.update(+id, updateCashflowTransaccionDto);
  }

  @RequirePermissions(PERMISOS.CASHFLOW_ELIMINAR)
  @Delete('transacciones/:id')
  @ApiOperation({ summary: 'Eliminar transacción' })
  remove(@Param('id') id: string) {
    return this.cashflowTransaccionService.remove(+id);
  }

  @RequirePermissions(PERMISOS.CASHFLOW_CONCILIAR)
  @Post('transacciones/:id/conciliar')
  @ApiOperation({ summary: 'Conciliar transacción con banco' })
  conciliar(@Param('id') id: string) {
    return this.cashflowTransaccionService.conciliar(+id);
  }

  @Get('resumen-semana')
  @RequirePermissions(PERMISOS.CASHFLOW_REPORTES)
  @ApiOperation({ summary: 'Obtener resumen de cashflow por semana' })
  @ApiQuery({ name: 'from', required: true, description: 'Fecha desde (YYYY-MM-DD)' })
  @ApiQuery({ name: 'to', required: true, description: 'Fecha hasta (YYYY-MM-DD)' })
  @ApiQuery({ name: 'incluirProyectado', required: false, description: 'Si incluir transacciones proyectadas' })
  getResumenSemana(
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('incluirProyectado', new ParseBoolPipe({ optional: true })) incluirProyectado?: boolean,
  ) {
    return this.cashflowTransaccionService.getResumenSemana(from, to, incluirProyectado);
  }

  @Get('resumen-mes')
  @RequirePermissions(PERMISOS.CASHFLOW_REPORTES)
  @ApiOperation({ summary: 'Obtener resumen de cashflow por mes' })
  @ApiQuery({ name: 'from', required: true, description: 'Fecha desde (YYYY-MM-DD)' })
  @ApiQuery({ name: 'to', required: true, description: 'Fecha hasta (YYYY-MM-DD)' })
  @ApiQuery({ name: 'incluirProyectado', required: false, description: 'Si incluir transacciones proyectadas' })
  getResumenMes(
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('incluirProyectado', new ParseBoolPipe({ optional: true })) incluirProyectado?: boolean,
  ) {
    return this.cashflowTransaccionService.getResumenMes(from, to, incluirProyectado);
  }

  @Get('resumen-trimestre')
  @RequirePermissions(PERMISOS.CASHFLOW_REPORTES)
  @ApiOperation({ summary: 'Obtener resumen de cashflow por trimestre' })
  @ApiQuery({ name: 'year', required: true, description: 'Año (YYYY)', type: Number })
  @ApiQuery({ name: 'incluirProyectado', required: false, description: 'Si incluir transacciones proyectadas' })
  getResumenTrimestre(
    @Query('year') year: string,
    @Query('incluirProyectado', new ParseBoolPipe({ optional: true })) incluirProyectado?: boolean,
  ) {
    return this.cashflowTransaccionService.getResumenTrimestre(Number(year), incluirProyectado);
  }

  @Get('resumen-semana-mes')
  @RequirePermissions(PERMISOS.CASHFLOW_REPORTES)
  @ApiOperation({ summary: 'Obtener resumen de cashflow por semanas del mes' })
  @ApiQuery({ name: 'year', required: true, description: 'Año (YYYY)', type: Number })
  @ApiQuery({ name: 'month', required: true, description: 'Mes (1-12)', type: Number })
  @ApiQuery({ name: 'incluirProyectado', required: false, description: 'Si incluir transacciones proyectadas' })
  getResumenSemanaMes(
    @Query('year') year: string,
    @Query('month') month: string,
    @Query('incluirProyectado', new ParseBoolPipe({ optional: true })) incluirProyectado?: boolean,
  ) {
    return this.cashflowTransaccionService.getResumenSemanaMes(Number(year), Number(month), incluirProyectado);
  }

  @Get('columnas')
  @RequirePermissions(PERMISOS.CASHFLOW_VER)
  @ApiOperation({ summary: 'Obtener columnas según el tipo de vista' })
  @ApiQuery({ name: 'vista', required: true, description: 'Tipo de vista (semanal | semanal-mes | mensual | trimestral)' })
  @ApiQuery({ name: 'from', required: false, description: 'Fecha desde (YYYY-MM-DD) para vista semanal' })
  @ApiQuery({ name: 'year', required: false, description: 'Año (YYYY) para vista mensual/trimestral/semanal-mes' })
  @ApiQuery({ name: 'month', required: false, description: 'Mes (1-12) para vista semanal-mes' })
  getColumnas(
    @Query('vista') vista: 'semanal' | 'semanal-mes' | 'mensual' | 'trimestral',
    @Query('from') from?: string,
    @Query('year') year?: string,
    @Query('month') month?: string,
  ) {
    return this.cashflowTransaccionService.getColumnas(vista, from, year ? Number(year) : undefined, month ? Number(month) : undefined);
  }

  // @Role([ROLE_FINANZAS])
  // @UseGuards(JwtAuthGuard, ApiKeyGuard, PermissionGuard)
  // @Get('proyecciones')
  // @ApiOperation({ summary: 'Obtener proyecciones de cashflow' })
  // @ApiQuery({ name: 'from', required: true, description: 'Fecha desde (YYYY-MM-DD)' })
  // @ApiQuery({ name: 'to', required: true, description: 'Fecha hasta (YYYY-MM-DD)' })
  // getProyecciones(
  //   @Query('from') from: string,
  //   @Query('to') to: string
  // ) {
  //   return this.cashflowTransaccionService.getProyecciones(from, to);
  // }
  @Get('reportes/totales')
  @RequirePermissions(PERMISOS.CASHFLOW_REPORTES)
  @ApiOperation({ summary: 'Obtener totales de período para dashboard' })
  @ApiQuery({ name: 'fechaInicio', required: true, description: 'Fecha inicio (YYYY-MM-DD)' })
  @ApiQuery({ name: 'fechaFin', required: true, description: 'Fecha fin (YYYY-MM-DD)' })
  @ApiQuery({ name: 'categoriasIngreso', required: false, description: 'IDs de categorías de ingreso separados por coma' })
  @ApiQuery({ name: 'categoriasEgreso', required: false, description: 'IDs de categorías de egreso separados por coma' })
  getTotalesPeriodo(
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
    @Query('categoriasIngreso') categoriasIngreso?: string,
    @Query('categoriasEgreso') categoriasEgreso?: string
  ) {
    const categoriasIngresoArray = categoriasIngreso ? categoriasIngreso.split(',') : undefined;
    const categoriasEgresoArray = categoriasEgreso ? categoriasEgreso.split(',') : undefined;
    return this.cashflowReportesService.getTotalesPeriodo(fechaInicio, fechaFin, categoriasIngresoArray, categoriasEgresoArray);
  }

  @Get('reportes/evolucion-ingresos-egresos')
  @RequirePermissions(PERMISOS.CASHFLOW_REPORTES)
  @ApiOperation({ summary: 'Obtener evolución de ingresos y egresos' })
  @ApiQuery({ name: 'fechaInicio', required: true, description: 'Fecha inicio (YYYY-MM-DD)' })
  @ApiQuery({ name: 'fechaFin', required: true, description: 'Fecha fin (YYYY-MM-DD)' })
  @ApiQuery({ name: 'modo', required: true, description: 'Modo de agrupación (dia | mes)' })
  @ApiQuery({ name: 'categoriasIngreso', required: false, description: 'IDs de categorías de ingreso separados por coma' })
  @ApiQuery({ name: 'categoriasEgreso', required: false, description: 'IDs de categorías de egreso separados por coma' })
  getEvolucionIngresosEgresos(
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
    @Query('modo') modo: 'dia' | 'mes',
    @Query('categoriasIngreso') categoriasIngreso?: string,
    @Query('categoriasEgreso') categoriasEgreso?: string
  ) {
    const categoriasIngresoArray = categoriasIngreso ? categoriasIngreso.split(',') : undefined;
    const categoriasEgresoArray = categoriasEgreso ? categoriasEgreso.split(',') : undefined;
    return this.cashflowReportesService.getEvolucionIngresosEgresos(fechaInicio, fechaFin, modo, categoriasIngresoArray, categoriasEgresoArray);
  }

  @Get('reportes/evolucion-saldo')
  @RequirePermissions(PERMISOS.CASHFLOW_REPORTES)
  @ApiOperation({ summary: 'Obtener evolución del saldo acumulado' })
  @ApiQuery({ name: 'fechaInicio', required: true, description: 'Fecha inicio (YYYY-MM-DD)' })
  @ApiQuery({ name: 'fechaFin', required: true, description: 'Fecha fin (YYYY-MM-DD)' })
  @ApiQuery({ name: 'modo', required: true, description: 'Modo de agrupación (dia | mes)' })
  @ApiQuery({ name: 'categoriasIngreso', required: false, description: 'IDs de categorías de ingreso separados por coma' })
  @ApiQuery({ name: 'categoriasEgreso', required: false, description: 'IDs de categorías de egreso separados por coma' })
  getEvolucionSaldo(
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
    @Query('modo') modo: 'dia' | 'mes',
    @Query('categoriasIngreso') categoriasIngreso?: string,
    @Query('categoriasEgreso') categoriasEgreso?: string
  ) {
    const categoriasIngresoArray = categoriasIngreso ? categoriasIngreso.split(',') : undefined;
    const categoriasEgresoArray = categoriasEgreso ? categoriasEgreso.split(',') : undefined;
    return this.cashflowReportesService.getEvolucionSaldoAcumulado(fechaInicio, fechaFin, modo, categoriasIngresoArray, categoriasEgresoArray);
  }

  @Get('reportes/proyeccion')
  @RequirePermissions(PERMISOS.CASHFLOW_REPORTES)
  @ApiOperation({ summary: 'Obtener proyección futura por tipo (ingresos o egresos pendientes desde hoy)' })
  @ApiQuery({ name: 'tipo', required: true, enum: ['ingreso', 'egreso'], description: 'Tipo de transacción a proyectar' })
  @ApiQuery({ name: 'fechaInicio', required: false, description: 'Fecha inicio del rango (YYYY-MM-DD)' })
  @ApiQuery({ name: 'fechaFin', required: false, description: 'Fecha fin del rango (YYYY-MM-DD)' })
  getProyeccion(
    @Query('tipo') tipo: 'ingreso' | 'egreso',
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
  ) {
    return this.cashflowReportesService.getProyeccion(tipo, fechaInicio, fechaFin);
  }

  @Get('reportes/transacciones-categoria')
  @RequirePermissions(PERMISOS.CASHFLOW_REPORTES)
  @ApiOperation({ summary: 'Obtener transacciones individuales de una categoría según modo de proyección' })
  @ApiQuery({ name: 'categoriaId', required: true, type: Number })
  @ApiQuery({ name: 'modo', required: true, enum: ['futuro', 'pasado', 'futuro-mes', 'pasado-mes'] })
  @ApiQuery({ name: 'fechaInicio', required: false })
  @ApiQuery({ name: 'fechaFin', required: false })
  getTransaccionesCategoria(
    @Query('categoriaId') categoriaId: string,
    @Query('modo') modo: 'futuro' | 'pasado' | 'futuro-mes' | 'pasado-mes',
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
  ) {
    return this.cashflowReportesService.getTransaccionesCategoria(
      Number(categoriaId),
      modo,
      fechaInicio,
      fechaFin,
    );
  }

  @Get('exportar-excel')
  @RequirePermissions(PERMISOS.CASHFLOW_VER)
  @ApiOperation({ summary: 'Exportar cashflow a Excel por categoría' })
  @ApiQuery({ name: 'from', required: true, description: 'Fecha desde (YYYY-MM-DD)' })
  @ApiQuery({ name: 'to', required: true, description: 'Fecha hasta (YYYY-MM-DD)' })
  @ApiQuery({ name: 'modo', required: true, description: 'Modo: dia | semana | mes | trimestre' })
  @ApiQuery({ name: 'incluirProyectado', required: false })
  async exportarExcel(
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('modo') modo: 'dia' | 'semana' | 'mes' | 'trimestre',
    @Query('incluirProyectado', new ParseBoolPipe({ optional: true })) incluirProyectado: boolean,
    @Res() res: Response,
  ) {
    const buffer = await this.cashflowTransaccionService.exportarExcel(from, to, modo, incluirProyectado);
    const nombreArchivo = `cashflow_${from}_${to}_${modo}.xlsx`;
    res.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.header('Content-Disposition', `attachment; filename="${nombreArchivo}"`);
    res.send(Buffer.from(buffer));
  }
}
