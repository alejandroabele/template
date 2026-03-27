import { ROLE_ADMIN, ROLE_FINANZAS } from '@/constants/roles';
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { Role } from '../auth/decorators/role/role.decorator';
import { ApiKeyGuard } from '../auth/guards/api-key/api-key.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { PermissionGuard } from '../auth/guards/permission/permission.guard';
import { CashflowCategoriaService } from './cashflow-categoria.service';
import { CreateCashflowCategoriaDto } from './dto/create-cashflow-categoria.dto';
import { UpdateCashflowCategoriaDto } from './dto/update-cashflow-categoria.dto';
import { PERMISOS } from '@/constants/permisos';
import { RequirePermissions } from '../auth/decorators/require-permissions/require-permissions.decorator';
import { AuthorizationGuard } from '../auth/guards/authorization/authorization.guard';

@Controller('cashflow-categoria')
@UseGuards(JwtAuthGuard, ApiKeyGuard, AuthorizationGuard)
export class CashflowCategoriaController {
  constructor(private readonly cashflowCategoriaService: CashflowCategoriaService) { }

  @RequirePermissions(PERMISOS.CASHFLOW_CATEGORIA_CREAR)
  @Post()
  create(@Body() createCashflowCategoriaDto: CreateCashflowCategoriaDto) {
    return this.cashflowCategoriaService.create(createCashflowCategoriaDto);
  }
  @Get()
  @RequirePermissions(PERMISOS.CASHFLOW_CATEGORIA_VER)
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

    return this.cashflowCategoriaService.findAll(options);
  }

  @RequirePermissions(PERMISOS.CASHFLOW_CATEGORIA_VER)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cashflowCategoriaService.findOne(id);
  }

  @RequirePermissions(PERMISOS.CASHFLOW_CATEGORIA_EDITAR)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateCashflowCategoriaDto: UpdateCashflowCategoriaDto) {
    return this.cashflowCategoriaService.update(id, updateCashflowCategoriaDto);
  }

  @Role([ROLE_FINANZAS, ROLE_ADMIN])
  @UseGuards(JwtAuthGuard, ApiKeyGuard, PermissionGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.cashflowCategoriaService.remove(id);
  }
}
