import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiKeyGuard } from '../auth/guards/api-key/api-key.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { OfertaService } from './oferta.service';
import { CreateOfertaDto } from './dto/create-oferta.dto';
import { UpdateOfertaDto } from './dto/update-oferta.dto';
import { PERMISOS } from '@/constants/permisos';
import { AuthorizationGuard } from '../auth/guards/authorization/authorization.guard';
import { RequirePermissions } from '../auth/decorators/require-permissions/require-permissions.decorator';

@Controller('oferta')
@UseGuards(JwtAuthGuard, ApiKeyGuard, AuthorizationGuard)
export class OfertaController {
    constructor(private readonly ofertaService: OfertaService) { }

    @RequirePermissions(PERMISOS.OFERTA_CREAR)
    @Post()
    create(@Body() createOfertaDto: CreateOfertaDto) {
        return this.ofertaService.create(createOfertaDto);
    }

    @RequirePermissions(PERMISOS.OFERTA_VER)
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

        return this.ofertaService.findAll(options);
    }

    @RequirePermissions(PERMISOS.OFERTA_VER)
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.ofertaService.findOne(id);
    }

    @RequirePermissions(PERMISOS.OFERTA_EDITAR)
    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updateOfertaDto: UpdateOfertaDto) {
        return this.ofertaService.update(id, updateOfertaDto);
    }

    @RequirePermissions(PERMISOS.OFERTA_ENVIAR_A_VALIDAR)
    @Patch(':id/enviar-a-validar')
    enviarAValidar(@Param('id', ParseIntPipe) id: number) {
        return this.ofertaService.enviarAValidar(id);
    }

    @RequirePermissions(PERMISOS.OFERTA_RECHAZAR)
    @Patch(':id/rechazar')
    rechazar(@Param('id', ParseIntPipe) id: number) {
        return this.ofertaService.rechazar(id);
    }

    @RequirePermissions(PERMISOS.OFERTA_ELIMINAR)
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.ofertaService.remove(id);
    }
}
