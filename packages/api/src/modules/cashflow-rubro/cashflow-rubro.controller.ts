import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ParseIntPipe } from '@nestjs/common';
import { CashflowRubroService } from './cashflow-rubro.service';
import { CreateCashflowRubroDto } from './dto/create-cashflow-rubro.dto';
import { UpdateCashflowRubroDto } from './dto/update-cashflow-rubro.dto';
import { ApiKeyGuard } from '../auth/guards/api-key/api-key.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { AuthorizationGuard } from '../auth/guards/authorization/authorization.guard';
import { RequirePermissions } from '../auth/decorators/require-permissions/require-permissions.decorator';
import { PERMISOS } from '@/constants/permisos';

@Controller('cashflow-rubro')
@UseGuards(JwtAuthGuard, ApiKeyGuard, AuthorizationGuard)
export class CashflowRubroController {
  constructor(private readonly cashflowRubroService: CashflowRubroService) { }

  @RequirePermissions(PERMISOS.CASHFLOW_RUBRO_CREAR)
  @Post()
  create(@Body() createCashflowRubroDto: CreateCashflowRubroDto) {
    return this.cashflowRubroService.create(createCashflowRubroDto);
  }

  @RequirePermissions(PERMISOS.CASHFLOW_RUBRO_VER)
  @Get()
  findAll(
    @Query('limit') take: number,
    @Query('skip') skip: number,
    @Query('filter') filter: string,
    @Query('order') order: string
  ) {
    const where = filter ? JSON.parse(filter) : [];
    const orderBy = order ? JSON.parse(order) : {};

    const options = {
      where,
      order: orderBy,
      take,
      skip,
    };

    return this.cashflowRubroService.findAll(options);
  }

  @RequirePermissions(PERMISOS.CASHFLOW_RUBRO_VER)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cashflowRubroService.findOne(id);
  }

  @RequirePermissions(PERMISOS.CASHFLOW_RUBRO_EDITAR)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateCashflowRubroDto: UpdateCashflowRubroDto) {
    return this.cashflowRubroService.update(id, updateCashflowRubroDto);
  }

  @RequirePermissions(PERMISOS.CASHFLOW_RUBRO_ELIMINAR)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.cashflowRubroService.remove(id);
  }
}
