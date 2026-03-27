import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiKeyGuard } from '../auth/guards/api-key/api-key.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { CuentaContableService } from './cuenta-contable.service';
import { CreateCuentaContableDto } from './dto/create-cuenta-contable.dto';
import { UpdateCuentaContableDto } from './dto/update-cuenta-contable.dto';
import { PERMISOS } from '@/constants/permisos';
import { AuthorizationGuard } from '../auth/guards/authorization/authorization.guard';
import { RequirePermissions } from '../auth/decorators/require-permissions/require-permissions.decorator';

@Controller('cuenta-contable')
@UseGuards(JwtAuthGuard, ApiKeyGuard, AuthorizationGuard)
export class CuentaContableController {
  constructor(private readonly cuentaContableService: CuentaContableService) { }

  @RequirePermissions(PERMISOS.CUENTA_CONTABLE_CREAR)
  @Post()
  create(@Body() createCuentaContableDto: CreateCuentaContableDto) {
    return this.cuentaContableService.create(createCuentaContableDto);
  }

  @RequirePermissions(PERMISOS.CUENTA_CONTABLE_VER)
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

    return this.cuentaContableService.findAll(options);
  }

  @RequirePermissions(PERMISOS.CUENTA_CONTABLE_VER)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cuentaContableService.findOne(id);
  }

  @RequirePermissions(PERMISOS.CUENTA_CONTABLE_EDITAR)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateCuentaContableDto: UpdateCuentaContableDto) {
    return this.cuentaContableService.update(id, updateCuentaContableDto);
  }

  @RequirePermissions(PERMISOS.CUENTA_CONTABLE_ELIMINAR)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.cuentaContableService.remove(id);
  }
}
