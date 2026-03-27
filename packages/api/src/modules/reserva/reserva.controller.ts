import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Query,
    UseGuards,
    Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ReservaService } from './reserva.service';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { ApiKeyGuard } from '../auth/guards/api-key/api-key.guard';
import { AuthorizationGuard } from '../auth/guards/authorization/authorization.guard';
import { RequirePermissions } from '../auth/decorators/require-permissions/require-permissions.decorator';
import { PERMISOS } from '@/constants/permisos';
import { InventarioService } from '../inventario/inventario.service';
import { EgresoMasivoDto } from '../movimiento-inventario/dto/egreso-masivo.dto';
import { ExcelExportService } from '@/services/excel-export/excel-export.service';

@Controller('reserva')
@UseGuards(JwtAuthGuard, ApiKeyGuard, AuthorizationGuard)
export class ReservaController {
    constructor(
        private readonly reservaService: ReservaService,
        private readonly inventarioService: InventarioService,
        private readonly excelExportService: ExcelExportService,
    ) { }

    @RequirePermissions(PERMISOS.RESERVA_CREAR)
    @Post()
    create(@Body() createReservaDto: CreateReservaDto) {
        return this.reservaService.create(createReservaDto);
    }

    @RequirePermissions(PERMISOS.RESERVA_VER)
    @Get('excel')
    async exportToExcel(
        @Query('limit') take: number,
        @Query('skip') skip: number,
        @Query('filter') filter: string,
        @Query('order') order: string,
        @Res() response: Response,
    ) {
        const where = filter ? JSON.parse(filter) : [];
        const orderBy = order ? JSON.parse(order) : {};

        const reservas = await this.reservaService.findAll({
            where,
            order: orderBy,
            take: Number.MAX_SAFE_INTEGER,
            skip,
        });

        const excelData = reservas.map((reserva) => ({
            'N° Reserva': reserva.id,
            'Fecha': reserva.fecha ? new Date(reserva.fecha).toLocaleDateString('es-AR') : '',
            'OT/Presupuesto': reserva.presupuesto?.id ? `#${reserva.presupuesto.id}` : '',
            'Trabajo': reserva.trabajo?.nombre || '',
            'Centro de Costo': reserva.centroCosto?.nombre || '',
            'Creado Por': reserva.createdByUser?.nombre || '',
            'Cantidad de Items': reserva.items?.length || 0,
            'Observaciones': reserva.observaciones || '',
        }));

        const fileBuffer = await this.excelExportService.generarExcel('reservas', excelData);

        response.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        response.header('Content-Disposition', 'attachment; filename="reservas.xlsx"');
        response.send(fileBuffer);
    }

    @RequirePermissions(PERMISOS.RESERVA_VER)
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

        return this.reservaService.findAll(options);
    }

    @RequirePermissions(PERMISOS.RESERVA_VER)
    @Get('validar-stock')
    validarStock(
        @Query('items') items: string,
    ) {
        return this.inventarioService.validarDisponibilidadConReservas(JSON.parse(items));
    }

    @RequirePermissions(PERMISOS.RESERVA_VER)
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.reservaService.findOne(id);
    }

    @RequirePermissions(PERMISOS.RESERVA_ELIMINAR)
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.reservaService.remove(id);
    }

    @RequirePermissions(PERMISOS.RESERVA_VER)
    @Get(':id/pdf')
    async downloadPdf(
        @Param('id', ParseIntPipe) id: number,
        @Res() res: Response
    ) {
        const buffer = await this.reservaService.generatePdf(id);

        const filename = `reserva-${id}.pdf`;

        res.header('Content-Type', 'application/pdf');
        res.header('Content-Disposition', `attachment; filename="${filename}"`);
        res.header('Content-Length', buffer.length.toString());

        res.send(buffer);
    }

    @RequirePermissions(PERMISOS.RESERVA_VER)
    @Post('egreso-ot/pdf')
    async downloadPdfEgresoOt(
        @Body() egresoMasivoDto: EgresoMasivoDto,
        @Res() res: Response,
    ) {
        const buffer = await this.reservaService.generatePdfEgresoOt(egresoMasivoDto);

        const filename = `egreso-ot-${egresoMasivoDto.presupuestoId || 'borrador'}.pdf`;

        res.header('Content-Type', 'application/pdf');
        res.header('Content-Disposition', `attachment; filename="${filename}"`);
        res.header('Content-Length', buffer.length.toString());

        res.send(buffer);
    }
}
