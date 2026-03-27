import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { TrailerService } from './trailer.service';
import { CreateTrailerDto } from './dto/create-trailer.dto';
import { UpdateTrailerDto } from './dto/update-trailer.dto';
import { ApiKeyGuard } from '@/modules/auth/guards/api-key/api-key.guard';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth/jwt-auth.guard';
import { AuthorizationGuard } from '@/modules/auth/guards/authorization/authorization.guard';
import { PERMISOS } from '@/constants/permisos';
import { RequirePermissions } from '@/modules/auth/decorators/require-permissions/require-permissions.decorator';

@UseGuards(JwtAuthGuard, ApiKeyGuard, AuthorizationGuard)
@Controller('trailer')
export class TrailerController {
    constructor(private readonly trailerService: TrailerService) {}

    @RequirePermissions(PERMISOS.TRAILERS_CREAR)
    @Post()
    create(@Body() createTrailerDto: CreateTrailerDto) {
        return this.trailerService.create(createTrailerDto);
    }

    @RequirePermissions(PERMISOS.TRAILERS_VER)
    @Get()
    findAll(
        @Query('limit') take: number,
        @Query('skip') skip: number,
        @Query('filter') filter: string,
        @Query('order') order: string,
    ) {
        const where = filter ? JSON.parse(filter) : [];
        const orderBy = order ? JSON.parse(order) : {};
        return this.trailerService.findAll({ where, order: orderBy, take, skip });
    }

    @RequirePermissions(PERMISOS.TRAILERS_VER)
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.trailerService.findOne(+id);
    }

    @RequirePermissions(PERMISOS.TRAILERS_EDITAR)
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateTrailerDto: UpdateTrailerDto) {
        return this.trailerService.update(+id, updateTrailerDto);
    }

    @RequirePermissions(PERMISOS.TRAILERS_ELIMINAR)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.trailerService.remove(+id);
    }
}
