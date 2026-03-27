import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { IndiceService } from './indice.service';
import { CreateIndiceDto } from './dto/create-indice.dto';
import { UpdateIndiceDto } from './dto/update-indice.dto';
import { ApiKeyGuard } from '../auth/guards/api-key/api-key.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { PermissionGuard } from '../auth/guards/permission/permission.guard';
import { PERMISOS } from '@/constants/permisos';
import { AuthorizationGuard } from '../auth/guards/authorization/authorization.guard';
import { RequirePermissions } from '../auth/decorators/require-permissions/require-permissions.decorator';

@Controller('indice')
@UseGuards(JwtAuthGuard, ApiKeyGuard, AuthorizationGuard)
export class IndiceController {
  constructor(private readonly indiceService: IndiceService) { }

  @RequirePermissions(PERMISOS.INDICE_CREAR)
  @Post()
  create(@Body() createIndiceDto: CreateIndiceDto) {
    return this.indiceService.create(createIndiceDto);
  }

  @RequirePermissions(PERMISOS.INDICE_VER)
  @Get()
  findAll(
    @Query('limit') take: number,
    @Query('skip') skip: number,
    @Query('filter') filter: string, // Recibe el filtro como string
    @Query('order') order: string,  // Recibe el orden como string

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

    return this.indiceService.findAll(options);
  }

  @RequirePermissions(PERMISOS.INDICE_VER)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.indiceService.findOne(id);
  }

  @RequirePermissions(PERMISOS.INDICE_EDITAR)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateIndiceDto: UpdateIndiceDto) {
    return this.indiceService.update(id, updateIndiceDto);
  }

  @RequirePermissions(PERMISOS.INDICE_ELIMINAR)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.indiceService.remove(id);
  }
}
