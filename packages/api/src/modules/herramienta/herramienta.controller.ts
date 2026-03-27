import { Controller, Get, Post, Body, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth/jwt-auth.guard';
import { ApiKeyGuard } from '@/modules/auth/guards/api-key/api-key.guard';
import { AuthorizationGuard } from '@/modules/auth/guards/authorization/authorization.guard';
import { RequirePermissions } from '@/modules/auth/decorators/require-permissions/require-permissions.decorator';
import { PERMISOS } from '@/constants/permisos';
import { HerramientaService } from './herramienta.service';
import { MovimientoHerramientaDto } from './dto/movimiento-herramienta.dto';

@Controller('herramientas')
@UseGuards(JwtAuthGuard, ApiKeyGuard, AuthorizationGuard)
export class HerramientaController {
    constructor(private readonly herramientaService: HerramientaService) { }

    @RequirePermissions(PERMISOS.HERRAMIENTA_VER)
    @Get()
    findAll(
        @Query('limit') take: number,
        @Query('skip') skip: number,
        @Query('filter') filter: string,
        @Query('order') order: string,
    ) {
        const where = filter ? JSON.parse(filter) : [];
        const orderBy = order ? JSON.parse(order) : {};
        return this.herramientaService.findAll({ where, order: orderBy, take, skip });
    }

    @RequirePermissions(PERMISOS.HERRAMIENTA_VER)
    @Get('prestamos-activos')
    getPrestamosActivos() {
        return this.herramientaService.getPrestamosActivos();
    }

    @RequirePermissions(PERMISOS.HERRAMIENTA_VER)
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.herramientaService.findOne(id);
    }

    @RequirePermissions(PERMISOS.HERRAMIENTA_VER)
    @Get(':id/historial')
    getHistorial(@Param('id', ParseIntPipe) id: number) {
        return this.herramientaService.getHistorial(id);
    }

    @RequirePermissions(PERMISOS.HERRAMIENTA_GESTIONAR)
    @Post(':id/movimiento')
    registrarMovimiento(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: MovimientoHerramientaDto,
    ) {
        return this.herramientaService.registrarMovimiento(id, dto);
    }
}
