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
import { EquipamientoService } from './equipamiento.service';
import { CreateEquipamientoDto } from './dto/create-equipamiento.dto';
import { UpdateEquipamientoDto } from './dto/update-equipamiento.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { ApiKeyGuard } from '../auth/guards/api-key/api-key.guard';
import { AuthorizationGuard } from '../auth/guards/authorization/authorization.guard';
import { RequirePermissions } from '../auth/decorators/require-permissions/require-permissions.decorator';
import { PERMISOS } from '@/constants/permisos';

@Controller('equipamiento')
@UseGuards(JwtAuthGuard, ApiKeyGuard, AuthorizationGuard)
export class EquipamientoController {
  constructor(private readonly equipamientoService: EquipamientoService) {}

  @RequirePermissions(PERMISOS.EQUIPAMIENTO_CREAR)
  @Post()
  create(@Body() createEquipamientoDto: CreateEquipamientoDto) {
    return this.equipamientoService.create(createEquipamientoDto);
  }

  @RequirePermissions(PERMISOS.EQUIPAMIENTO_VER)
  @Get()
  findAll(
    @Query('limit') take: number,
    @Query('skip') skip: number,
    @Query('filter') filter: string,
    @Query('order') order: string,
  ) {
    const where = filter ? JSON.parse(filter) : [];
    const orderBy = order ? JSON.parse(order) : {};
    return this.equipamientoService.findAll({ where, order: orderBy, take, skip });
  }

  @RequirePermissions(PERMISOS.EQUIPAMIENTO_VER)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.equipamientoService.findOne(id);
  }

  @RequirePermissions(PERMISOS.EQUIPAMIENTO_EDITAR)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEquipamientoDto: UpdateEquipamientoDto,
  ) {
    return this.equipamientoService.update(id, updateEquipamientoDto);
  }

  @RequirePermissions(PERMISOS.EQUIPAMIENTO_ELIMINAR)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.equipamientoService.remove(id);
  }
}
