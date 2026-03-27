import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { RecetaService } from './receta.service';
import { CreateRecetaDto } from './dto/create-receta.dto';
import { UpdateRecetaDto } from './dto/update-receta.dto';
import { PERMISOS } from '@/constants/permisos';
import { AuthorizationGuard } from '../auth/guards/authorization/authorization.guard';
import { RequirePermissions } from '../auth/decorators/require-permissions/require-permissions.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { ApiKeyGuard } from '../auth/guards/api-key/api-key.guard';



@Controller('receta')
@UseGuards(JwtAuthGuard, ApiKeyGuard, AuthorizationGuard)
export class RecetaController {
  constructor(private readonly recetaService: RecetaService) { }

  @Post()
  @RequirePermissions(PERMISOS.PRESUPUESTO_RECETA_CREAR)
  create(@Body() createRecetaDto: CreateRecetaDto) {
    return this.recetaService.create(createRecetaDto);
  }

  @Get()
  @RequirePermissions(PERMISOS.PRESUPUESTO_RECETA_VER)
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
    return this.recetaService.findAll(options);
  }

  @Get(':id')
  @RequirePermissions(PERMISOS.PRESUPUESTO_RECETA_CREAR)
  findOne(@Param('id') id: string) {
    return this.recetaService.findOne(+id);
  }

  @Patch(':id')
  @RequirePermissions(PERMISOS.PRESUPUESTO_RECETA_EDITAR)
  update(@Param('id') id: string, @Body() updateRecetaDto: UpdateRecetaDto) {
    return this.recetaService.update(+id, updateRecetaDto);
  }

  @Delete(':id')
  @RequirePermissions(PERMISOS.PRESUPUESTO_RECETA_ELIMINAR)
  remove(@Param('id') id: string) {
    return this.recetaService.remove(+id);
  }
}
