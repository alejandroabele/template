import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ProcesoGeneralService } from './proceso-general.service';
import { CreateProcesoGeneralDto } from './dto/create-proceso-general.dto';
import { UpdateProcesoGeneralDto } from './dto/update-proceso-general.dto';
import { ApiKeyGuard } from '../auth/guards/api-key/api-key.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { RequirePermissions } from '../auth/decorators/require-permissions/require-permissions.decorator';
import { AuthorizationGuard } from '../auth/guards/authorization/authorization.guard';
import { PERMISOS } from '@/constants/permisos';


@UseGuards(JwtAuthGuard, ApiKeyGuard, AuthorizationGuard)

@Controller('proceso-general')
export class ProcesoGeneralController {
  constructor(private readonly procesoGeneralService: ProcesoGeneralService) { }

  @Post()
  @RequirePermissions(PERMISOS.PROCESO_GENERAL_CREAR)
  create(@Body() createProcesoGeneralDto: CreateProcesoGeneralDto) {
    return this.procesoGeneralService.create(createProcesoGeneralDto);
  }

  @Get()
  @RequirePermissions(PERMISOS.PROCESO_GENERAL_VER)
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
    return this.procesoGeneralService.findAll(options);
  }

  @Get(':id')
  @RequirePermissions(PERMISOS.PROCESO_GENERAL_VER)
  findOne(@Param('id') id: string) {
    return this.procesoGeneralService.findOne(+id);
  }

  @Patch(':id')
  @RequirePermissions(PERMISOS.PROCESO_GENERAL_EDITAR)
  update(@Param('id') id: string, @Body() updateProcesoGeneralDto: UpdateProcesoGeneralDto) {
    return this.procesoGeneralService.update(+id, updateProcesoGeneralDto);
  }

  @Delete(':id')
  @RequirePermissions(PERMISOS.PROCESO_GENERAL_ELIMINAR)
  remove(@Param('id') id: string) {
    return this.procesoGeneralService.remove(+id);
  }
}
