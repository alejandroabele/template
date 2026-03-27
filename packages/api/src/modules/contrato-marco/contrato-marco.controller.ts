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
import { ContratoMarcoService } from './contrato-marco.service';
import { CreateContratoMarcoDto } from './dto/create-contrato-marco.dto';
import { UpdateContratoMarcoDto } from './dto/update-contrato-marco.dto';
import { ContratoMarcoReportesService } from './contrato-marco-reportes.service'
import { PERMISOS } from '@/constants/permisos';
import { AuthorizationGuard } from '../auth/guards/authorization/authorization.guard';
import { RequirePermissions } from '../auth/decorators/require-permissions/require-permissions.decorator';

@Controller('contrato-marco')
@UseGuards(JwtAuthGuard, ApiKeyGuard, AuthorizationGuard)
export class ContratoMarcoController {
  constructor(
    private readonly contratoMarcoService: ContratoMarcoService,
    private readonly contratoMarcoReportesService: ContratoMarcoReportesService,

  ) { }

  @RequirePermissions(PERMISOS.CONTRATO_MARCO_CREAR)
  @Post()
  create(@Body() createContratoMarcoDto: CreateContratoMarcoDto) {
    return this.contratoMarcoService.create(createContratoMarcoDto);
  }

  @Get()
  @RequirePermissions(PERMISOS.CONTRATO_MARCO_VER)
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
    return this.contratoMarcoService.findAll(options);
  }

  @Get(':id')
  @RequirePermissions(PERMISOS.CONTRATO_MARCO_VER)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.contratoMarcoService.findOne(id);
  }

  @Patch(':id')
  @RequirePermissions(PERMISOS.CONTRATO_MARCO_EDITAR)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateContratoMarcoDto: UpdateContratoMarcoDto,
  ) {
    return this.contratoMarcoService.update(id, updateContratoMarcoDto);
  }

  @Delete(':id')
  @RequirePermissions(PERMISOS.CONTRATO_MARCO_ELIMINAR)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.contratoMarcoService.remove(id);
  }

  @RequirePermissions(PERMISOS.CONTRATO_MARCO_REPORTES)
  @Get('reportes/estado-consumo/:id')
  async getEstadoConsumo(@Param('id', ParseIntPipe) id: number) {
    return this.contratoMarcoReportesService.getEstadoConsumo(id);
  }

  @RequirePermissions(PERMISOS.CONTRATO_MARCO_REPORTES)
  @Get('reportes/ordenes-tipo/:id')
  async getOrdenesPorTipo(@Param('id', ParseIntPipe) id: number) {
    return this.contratoMarcoReportesService.getOrdenesPorTipo(id);
  }
}
