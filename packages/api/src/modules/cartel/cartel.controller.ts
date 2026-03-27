import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { CartelService } from './cartel.service';
import { CreateCartelDto } from './dto/create-cartel.dto';
import { UpdateCartelDto } from './dto/update-cartel.dto';
import { ApiKeyGuard } from '@/modules/auth/guards/api-key/api-key.guard';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth/jwt-auth.guard';
import { AuthorizationGuard } from '@/modules/auth/guards/authorization/authorization.guard';
import { PERMISOS } from '@/constants/permisos';
import { RequirePermissions } from '@/modules/auth/decorators/require-permissions/require-permissions.decorator';

@UseGuards(JwtAuthGuard, ApiKeyGuard, AuthorizationGuard)
@Controller('cartel')
export class CartelController {
    constructor(private readonly cartelService: CartelService) {}

    @RequirePermissions(PERMISOS.CARTELES_CREAR)
    @Post()
    create(@Body() createCartelDto: CreateCartelDto) {
        return this.cartelService.create(createCartelDto);
    }

    @RequirePermissions(PERMISOS.CARTELES_VER)
    @Get()
    findAll(
        @Query('limit') take: number,
        @Query('skip') skip: number,
        @Query('filter') filter: string,
        @Query('order') order: string,
    ) {
        const where = filter ? JSON.parse(filter) : [];
        const orderBy = order ? JSON.parse(order) : {};
        return this.cartelService.findAll({ where, order: orderBy, take, skip });
    }

    @RequirePermissions(PERMISOS.CARTELES_VER)
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.cartelService.findOne(+id);
    }

    @RequirePermissions(PERMISOS.CARTELES_EDITAR)
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateCartelDto: UpdateCartelDto) {
        return this.cartelService.update(+id, updateCartelDto);
    }

    @RequirePermissions(PERMISOS.CARTELES_ELIMINAR)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.cartelService.remove(+id);
    }
}
