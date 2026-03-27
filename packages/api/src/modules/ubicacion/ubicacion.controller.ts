import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { UbicacionService } from './ubicacion.service';
import { CreateUbicacionDto } from './dto/create-ubicacion.dto';
import { UpdateUbicacionDto } from './dto/update-ubicacion.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { ApiKeyGuard } from '../auth/guards/api-key/api-key.guard';
import { AuthorizationGuard } from '../auth/guards/authorization/authorization.guard';
import { RequirePermissions } from '../auth/decorators/require-permissions/require-permissions.decorator';
import { PERMISOS } from '@/constants/permisos';

@Controller('ubicacion')
@UseGuards(JwtAuthGuard, ApiKeyGuard, AuthorizationGuard)
export class UbicacionController {
  constructor(private readonly ubicacionService: UbicacionService) {}

  @RequirePermissions(PERMISOS.UBICACION_CREAR)
  @Post()
  create(@Body() createUbicacionDto: CreateUbicacionDto) {
    return this.ubicacionService.create(createUbicacionDto);
  }

  @RequirePermissions(PERMISOS.UBICACION_VER)
  @Get()
  findAll(
    @Query('limit') take: number,
    @Query('skip') skip: number,
    @Query('filter') filter: string,
    @Query('order') order: string,
  ) {
    const where = filter ? JSON.parse(filter) : [];
    const orderBy = order ? JSON.parse(order) : {};
    return this.ubicacionService.findAll({ where, order: orderBy, take, skip });
  }

  @RequirePermissions(PERMISOS.UBICACION_VER)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ubicacionService.findOne(id);
  }

  @RequirePermissions(PERMISOS.UBICACION_EDITAR)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUbicacionDto: UpdateUbicacionDto,
  ) {
    return this.ubicacionService.update(id, updateUbicacionDto);
  }

  @RequirePermissions(PERMISOS.UBICACION_ELIMINAR)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ubicacionService.remove(id);
  }
}
