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

import { ApiKeyGuard } from '../auth/guards/api-key/api-key.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { ContratoMarcoPresupuestoService } from './contrato-marco-presupuesto.service';
import { CreateContratoMarcoPresupuestoDto } from './dto/create-contrato-marco-presupuesto.dto';
import { UpdateContratoMarcoPresupuestoDto } from './dto/update-contrato-marco-presupuesto.dto';
import { PERMISOS } from '@/constants/permisos';
import { AuthorizationGuard } from '../auth/guards/authorization/authorization.guard';
import { RequirePermissions } from '../auth/decorators/require-permissions/require-permissions.decorator';


@Controller('contrato-marco-presupuesto')
@UseGuards(JwtAuthGuard, ApiKeyGuard, AuthorizationGuard)
export class ContratoMarcoPresupuestoController {
  constructor(private readonly contratoMarcoPresupuestoService: ContratoMarcoPresupuestoService) { }

  @RequirePermissions(PERMISOS.CONTRATO_MARCO_PRESUPUESTO_CREAR)
  @Post()
  create(@Body() createContratoMarcoPresupuestoDto: CreateContratoMarcoPresupuestoDto) {
    return this.contratoMarcoPresupuestoService.create(createContratoMarcoPresupuestoDto);
  }
  @RequirePermissions(PERMISOS.CONTRATO_MARCO_PRESUPUESTO_VER)
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
    return this.contratoMarcoPresupuestoService.findAll(options);
  }

  @RequirePermissions(PERMISOS.CONTRATO_MARCO_PRESUPUESTO_VER)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.contratoMarcoPresupuestoService.findOne(id);
  }

  @RequirePermissions(PERMISOS.CONTRATO_MARCO_PRESUPUESTO_EDITAR)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateContratoMarcoPresupuestoDto: UpdateContratoMarcoPresupuestoDto,
  ) {
    return this.contratoMarcoPresupuestoService.update(id, updateContratoMarcoPresupuestoDto);
  }

  @RequirePermissions(PERMISOS.CONTRATO_MARCO_PRESUPUESTO_ELIMINAR)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.contratoMarcoPresupuestoService.remove(id);
  }
}
