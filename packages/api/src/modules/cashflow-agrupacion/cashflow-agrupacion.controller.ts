import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { ApiKeyGuard } from '../auth/guards/api-key/api-key.guard';
import { AuthorizationGuard } from '../auth/guards/authorization/authorization.guard';
import { RequirePermissions } from '../auth/decorators/require-permissions/require-permissions.decorator';
import { PERMISOS } from '@/constants/permisos';
import { CashflowAgrupacionService } from './cashflow-agrupacion.service';
import { CreateCashflowAgrupacionDto } from './dto/create-cashflow-agrupacion.dto';
import { UpdateCashflowAgrupacionDto } from './dto/update-cashflow-agrupacion.dto';

@Controller('cashflow-agrupacion')
@UseGuards(JwtAuthGuard, ApiKeyGuard, AuthorizationGuard)
export class CashflowAgrupacionController {
  constructor(private readonly cashflowAgrupacionService: CashflowAgrupacionService) {}

  @Get()
  @RequirePermissions(PERMISOS.CASHFLOW_AGRUPACION_VER)
  findAll() {
    return this.cashflowAgrupacionService.findAll();
  }

  @Get(':id')
  @RequirePermissions(PERMISOS.CASHFLOW_AGRUPACION_VER)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cashflowAgrupacionService.findOne(id);
  }

  @Post()
  @RequirePermissions(PERMISOS.CASHFLOW_AGRUPACION_CREAR)
  create(@Body() dto: CreateCashflowAgrupacionDto) {
    return this.cashflowAgrupacionService.create(dto);
  }

  @Patch(':id')
  @RequirePermissions(PERMISOS.CASHFLOW_AGRUPACION_EDITAR)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCashflowAgrupacionDto) {
    return this.cashflowAgrupacionService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermissions(PERMISOS.CASHFLOW_AGRUPACION_ELIMINAR)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.cashflowAgrupacionService.remove(id);
  }
}
