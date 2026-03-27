import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { FacturaService } from './factura.service';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { UpdateFacturaDto } from './dto/update-factura.dto';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth/jwt-auth.guard';
import { ApiKeyGuard } from '@/modules/auth/guards/api-key/api-key.guard';
import { AuthorizationGuard } from '@/modules/auth/guards/authorization/authorization.guard';
import { RequirePermissions } from '@/modules/auth/decorators/require-permissions/require-permissions.decorator';
import { PERMISOS } from '@/constants/permisos';

@Controller('factura')
@UseGuards(JwtAuthGuard, ApiKeyGuard, AuthorizationGuard)
export class FacturaController {
  constructor(private readonly facturaService: FacturaService) { }

  @RequirePermissions(PERMISOS.FACTURA_CREAR)
  @Post()
  create(@Body() createFacturaDto: CreateFacturaDto) {
    return this.facturaService.create(createFacturaDto);
  }

  @RequirePermissions(PERMISOS.FACTURA_VER)
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

    return this.facturaService.findAll(options);
  }

  @RequirePermissions(PERMISOS.FACTURA_VER)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.facturaService.findOne(id);
  }

  @RequirePermissions(PERMISOS.FACTURA_EDITAR)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateFacturaDto: UpdateFacturaDto) {
    return this.facturaService.update(id, updateFacturaDto);
  }

  @RequirePermissions(PERMISOS.FACTURA_ELIMINAR)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.facturaService.remove(id);
  }
}
