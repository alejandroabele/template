import { Controller, Get, Post, Body, Param, Delete, Put, Query, UseGuards, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth/jwt-auth.guard';
import { ApiKeyGuard } from '@/modules/auth/guards/api-key/api-key.guard';
import { AuthorizationGuard } from '@/modules/auth/guards/authorization/authorization.guard';
import { RequirePermissions } from '@/modules/auth/decorators/require-permissions/require-permissions.decorator';
import { PERMISOS } from '@/constants/permisos';
import { CashflowSimulacionService } from './cashflow-simulacion.service';
import { CashflowSimulacionTransaccionService } from './cashflow-simulacion-transaccion.service';
import { CashflowSimulacionTransaccion } from './entities/cashflow-simulacion-transaccion.entity';
import { CreateCashflowSimulacionDto } from './dto/create-cashflow-simulacion.dto';
import { UpdateCashflowSimulacionDto } from './dto/update-cashflow-simulacion.dto';
import { CreateCashflowSimulacionTransaccionDto } from './dto/create-cashflow-simulacion-transaccion.dto';
import { UpdateCashflowSimulacionTransaccionDto } from './dto/update-cashflow-simulacion-transaccion.dto';

@ApiTags('cashflow-simulaciones')
@Controller('cashflow/simulaciones')
@UseGuards(JwtAuthGuard, ApiKeyGuard, AuthorizationGuard)
export class CashflowSimulacionController {
    constructor(
        private readonly simulacionService: CashflowSimulacionService,
        private readonly simulacionTransaccionService: CashflowSimulacionTransaccionService,
        @InjectRepository(CashflowSimulacionTransaccion)
        private readonly simulacionTransaccionRepository: Repository<CashflowSimulacionTransaccion>,
    ) {}

    // ========== GESTIÓN DE SIMULACIONES ==========

    @Get()
    @RequirePermissions(PERMISOS.CASHFLOW_SIMULACION_VER)
    @ApiOperation({ summary: 'Listar todas las simulaciones' })
    findAll() {
        return this.simulacionService.findAll();
    }

    @Post()
    @RequirePermissions(PERMISOS.CASHFLOW_SIMULACION_CREAR)
    @ApiOperation({ summary: 'Crear nueva simulación' })
    create(@Body() dto: CreateCashflowSimulacionDto) {
        return this.simulacionService.create(dto);
    }

    @Get(':id')
    @RequirePermissions(PERMISOS.CASHFLOW_SIMULACION_VER)
    @ApiOperation({ summary: 'Obtener simulación por ID' })
    findOne(@Param('id') id: string) {
        return this.simulacionService.findOne(+id);
    }

    @Put(':id')
    @RequirePermissions(PERMISOS.CASHFLOW_SIMULACION_EDITAR)
    @ApiOperation({ summary: 'Editar nombre/descripción de simulación' })
    update(@Param('id') id: string, @Body() dto: UpdateCashflowSimulacionDto) {
        return this.simulacionService.update(+id, dto);
    }

    @Delete(':id')
    @RequirePermissions(PERMISOS.CASHFLOW_SIMULACION_ELIMINAR)
    @ApiOperation({ summary: 'Eliminar simulación y sus transacciones' })
    remove(@Param('id') id: string) {
        return this.simulacionService.remove(+id);
    }

    // ========== TRANSACCIONES DE SIMULACIÓN ==========

    @Post(':id/transacciones')
    @RequirePermissions(PERMISOS.CASHFLOW_SIMULACION_EDITAR)
    @ApiOperation({ summary: 'Crear transacción en una simulación' })
    async createTransaccion(
        @Param('id') id: string,
        @Body() dto: CreateCashflowSimulacionTransaccionDto,
    ) {
        const transaccion = this.simulacionTransaccionRepository.create({ ...dto, simulacionId: +id });
        return this.simulacionTransaccionRepository.save(transaccion);
    }

    @Put(':id/transacciones/:tid')
    @RequirePermissions(PERMISOS.CASHFLOW_SIMULACION_EDITAR)
    @ApiOperation({ summary: 'Editar transacción en una simulación' })
    async updateTransaccion(
        @Param('id') id: string,
        @Param('tid') tid: string,
        @Body() dto: UpdateCashflowSimulacionTransaccionDto,
    ) {
        const transaccion = await this.simulacionTransaccionRepository.findOne({ where: { id: +tid, simulacionId: +id } });
        if (!transaccion) throw new NotFoundException(`Transacción ${tid} no encontrada en simulación ${id}`);
        await this.simulacionTransaccionRepository.update(+tid, dto);
        return this.simulacionTransaccionRepository.findOne({ where: { id: +tid }, relations: ['categoria', 'banco'] });
    }

    @Delete(':id/transacciones/:tid')
    @RequirePermissions(PERMISOS.CASHFLOW_SIMULACION_EDITAR)
    @ApiOperation({ summary: 'Eliminar transacción de una simulación' })
    async removeTransaccion(
        @Param('id') id: string,
        @Param('tid') tid: string,
    ) {
        const transaccion = await this.simulacionTransaccionRepository.findOne({ where: { id: +tid, simulacionId: +id } });
        if (!transaccion) throw new NotFoundException(`Transacción ${tid} no encontrada en simulación ${id}`);
        return this.simulacionTransaccionRepository.delete(+tid);
    }

    @Get(':id/transacciones/busqueda')
    @RequirePermissions(PERMISOS.CASHFLOW_SIMULACION_VER)
    @ApiOperation({ summary: 'Buscar transacciones en una simulación' })
    @ApiQuery({ name: 'filter', required: false })
    @ApiQuery({ name: 'order', required: false })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'skip', required: false, type: Number })
    buscarTransacciones(
        @Param('id') id: string,
        @Query('filter') filter?: string,
        @Query('order') order?: string,
        @Query('limit') limit?: number,
        @Query('skip') skip?: number,
    ) {
        const where = filter ? JSON.parse(filter) : {};
        const orderBy = order ? JSON.parse(order) : {};
        const conditions = { where, order: orderBy, take: limit ? Number(limit) : undefined, skip: skip ? Number(skip) : undefined };
        return this.simulacionTransaccionService.findBusqueda(+id, conditions);
    }

    // ========== RESÚMENES DE SIMULACIÓN ==========

    @Get(':id/resumen-semana')
    @RequirePermissions(PERMISOS.CASHFLOW_SIMULACION_VER)
    @ApiOperation({ summary: 'Resumen semanal de simulación' })
    @ApiQuery({ name: 'from', required: true })
    @ApiQuery({ name: 'to', required: true })
    getResumenSemana(
        @Param('id') id: string,
        @Query('from') from: string,
        @Query('to') to: string,
    ) {
        return this.simulacionTransaccionService.getResumenSemana(+id, from, to);
    }

    @Get(':id/resumen-mes')
    @RequirePermissions(PERMISOS.CASHFLOW_SIMULACION_VER)
    @ApiOperation({ summary: 'Resumen mensual de simulación' })
    @ApiQuery({ name: 'from', required: true })
    @ApiQuery({ name: 'to', required: true })
    getResumenMes(
        @Param('id') id: string,
        @Query('from') from: string,
        @Query('to') to: string,
    ) {
        return this.simulacionTransaccionService.getResumenMes(+id, from, to);
    }

    @Get(':id/resumen-trimestre')
    @RequirePermissions(PERMISOS.CASHFLOW_SIMULACION_VER)
    @ApiOperation({ summary: 'Resumen trimestral de simulación' })
    @ApiQuery({ name: 'year', required: true, type: Number })
    getResumenTrimestre(
        @Param('id') id: string,
        @Query('year') year: string,
    ) {
        return this.simulacionTransaccionService.getResumenTrimestre(+id, Number(year));
    }

    @Get(':id/resumen-semana-mes')
    @RequirePermissions(PERMISOS.CASHFLOW_SIMULACION_VER)
    @ApiOperation({ summary: 'Resumen por semanas del mes de simulación' })
    @ApiQuery({ name: 'year', required: true, type: Number })
    @ApiQuery({ name: 'month', required: true, type: Number })
    getResumenSemanaMes(
        @Param('id') id: string,
        @Query('year') year: string,
        @Query('month') month: string,
    ) {
        return this.simulacionTransaccionService.getResumenSemanaMes(+id, Number(year), Number(month));
    }

    @Get(':id/columnas')
    @RequirePermissions(PERMISOS.CASHFLOW_SIMULACION_VER)
    @ApiOperation({ summary: 'Obtener columnas para una vista de simulación' })
    @ApiQuery({ name: 'vista', required: true })
    @ApiQuery({ name: 'from', required: false })
    @ApiQuery({ name: 'year', required: false, type: Number })
    @ApiQuery({ name: 'month', required: false, type: Number })
    getColumnas(
        @Param('id') id: string,
        @Query('vista') vista: 'semanal' | 'semanal-mes' | 'mensual' | 'trimestral',
        @Query('from') from?: string,
        @Query('year') year?: string,
        @Query('month') month?: string,
    ) {
        return this.simulacionTransaccionService.getColumnas(vista, from, year ? Number(year) : undefined, month ? Number(month) : undefined);
    }
}
