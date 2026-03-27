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
import { FlotaService } from './flota.service';
import { CreateFlotaDto } from './dto/create-flota.dto';
import { UpdateFlotaDto } from './dto/update-flota.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { ApiKeyGuard } from '../auth/guards/api-key/api-key.guard';
import { AuthorizationGuard } from '../auth/guards/authorization/authorization.guard';
import { RequirePermissions } from '../auth/decorators/require-permissions/require-permissions.decorator';
import { PERMISOS } from '@/constants/permisos';

@Controller('flota')
@UseGuards(JwtAuthGuard, ApiKeyGuard, AuthorizationGuard)
export class FlotaController {
  constructor(private readonly flotaService: FlotaService) {}

  @RequirePermissions(PERMISOS.FLOTA_CREAR)
  @Post()
  create(@Body() createFlotaDto: CreateFlotaDto) {
    return this.flotaService.create(createFlotaDto);
  }

  @RequirePermissions(PERMISOS.FLOTA_VER)
  @Get()
  findAll(
    @Query('limit') take: number,
    @Query('skip') skip: number,
    @Query('filter') filter: string,
    @Query('order') order: string,
  ) {
    const where = filter ? JSON.parse(filter) : [];
    const orderBy = order ? JSON.parse(order) : {};
    return this.flotaService.findAll({ where, order: orderBy, take, skip });
  }

  @RequirePermissions(PERMISOS.FLOTA_VER)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.flotaService.findOne(id);
  }

  @RequirePermissions(PERMISOS.FLOTA_EDITAR)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFlotaDto: UpdateFlotaDto,
  ) {
    return this.flotaService.update(id, updateFlotaDto);
  }

  @RequirePermissions(PERMISOS.FLOTA_ELIMINAR)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.flotaService.remove(id);
  }
}
