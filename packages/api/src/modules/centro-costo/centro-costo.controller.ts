import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { CentroCostoService } from './centro-costo.service';
import { CreateCentroCostoDto } from './dto/create-centro-costo.dto';
import { UpdateCentroCostoDto } from './dto/update-centro-costo.dto';
import { ApiKeyGuard } from '../auth/guards/api-key/api-key.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { PERMISOS } from '@/constants/permisos';
import { AuthorizationGuard } from '../auth/guards/authorization/authorization.guard';
import { RequirePermissions } from '../auth/decorators/require-permissions/require-permissions.decorator';

@Controller('centro-costo')
@UseGuards(JwtAuthGuard, ApiKeyGuard, AuthorizationGuard)
export class CentroCostoController {
  constructor(private readonly centroCostoService: CentroCostoService) { }

  @Post()
  @RequirePermissions(PERMISOS.CENTRO_COSTO_CREAR)
  create(@Body() createCentroCostoDto: CreateCentroCostoDto) {
    return this.centroCostoService.create(createCentroCostoDto);
  }

  @Get()
  @RequirePermissions(PERMISOS.CENTRO_COSTO_VER)
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
    return this.centroCostoService.findAll(options);
  }

  @Get(':id')
  @RequirePermissions(PERMISOS.CENTRO_COSTO_VER)
  findOne(@Param('id') id: string) {
    return this.centroCostoService.findOne(+id);
  }

  @Patch(':id')
  @RequirePermissions(PERMISOS.CENTRO_COSTO_EDITAR)
  update(@Param('id') id: string, @Body() updateCentroCostoDto: UpdateCentroCostoDto) {
    return this.centroCostoService.update(+id, updateCentroCostoDto);
  }

  @RequirePermissions(PERMISOS.CENTRO_COSTO_ELIMINAR)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.centroCostoService.remove(+id);
  }
}
