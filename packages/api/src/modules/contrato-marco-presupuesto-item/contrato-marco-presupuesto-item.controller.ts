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
import { ContratoMarcoPresupuestoItemService } from './contrato-marco-presupuesto-item.service';
import { CreateContratoMarcoPresupuestoItemDto } from './dto/create-contrato-marco-presupuesto-item.dto';
import { UpdateContratoMarcoPresupuestoItemDto } from './dto/update-contrato-marco-presupuesto-item.dto';
import { PERMISOS } from '@/constants/permisos';
import { AuthorizationGuard } from '../auth/guards/authorization/authorization.guard';
import { RequirePermissions } from '../auth/decorators/require-permissions/require-permissions.decorator';





@Controller('contrato-marco-presupuesto-item')
@UseGuards(JwtAuthGuard, ApiKeyGuard, AuthorizationGuard)
export class ContratoMarcoPresupuestoItemController {
  constructor(private readonly contratoMarcoPresupuestoService: ContratoMarcoPresupuestoItemService) { }

  @RequirePermissions(PERMISOS.CONTRATO_MARCO_PRESUPUESTO_CREAR)
  @Post()
  create(@Body() createContratoMarcoPresupuestoItemDto: CreateContratoMarcoPresupuestoItemDto) {
    return this.contratoMarcoPresupuestoService.create(createContratoMarcoPresupuestoItemDto);
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
    @Body() updateContratoMarcoPresupuestoItemDto: UpdateContratoMarcoPresupuestoItemDto,
  ) {
    return this.contratoMarcoPresupuestoService.update(id, updateContratoMarcoPresupuestoItemDto);
  }

  @RequirePermissions(PERMISOS.CONTRATO_MARCO_PRESUPUESTO_ELIMINAR)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.contratoMarcoPresupuestoService.remove(id);
  }
}
