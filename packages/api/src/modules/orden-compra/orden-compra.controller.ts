import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Res, UseGuards } from '@nestjs/common';
import { ApiKeyGuard } from '../auth/guards/api-key/api-key.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { OrdenCompraService } from './orden-compra.service';
import { CreateOrdenCompraDto } from './dto/create-orden-compra.dto';
import { UpdateOrdenCompraDto } from './dto/update-orden-compra.dto';
import { PERMISOS } from '@/constants/permisos';
import { AuthorizationGuard } from '../auth/guards/authorization/authorization.guard';
import { RequirePermissions } from '../auth/decorators/require-permissions/require-permissions.decorator';
import { Response } from 'express';

@Controller('orden-compra')
@UseGuards(JwtAuthGuard, ApiKeyGuard, AuthorizationGuard)
export class OrdenCompraController {
  constructor(private readonly ordenCompraService: OrdenCompraService) { }

  @RequirePermissions(PERMISOS.ORDEN_COMPRA_CREAR)
  @Post()
  create(@Body() createOrdenCompraDto: CreateOrdenCompraDto) {
    return this.ordenCompraService.create(createOrdenCompraDto);
  }

  @RequirePermissions(PERMISOS.ORDEN_COMPRA_VER)
  @Get()
  findAll(
    @Query('limit') take: number,
    @Query('skip') skip: number,
    @Query('filter') filter: string,
    @Query('order') order: string,
    @Query('solcomId') solcomId: string,
  ) {
    const where = filter ? JSON.parse(filter) : [];
    const orderBy = order ? JSON.parse(order) : {};

    const options = {
      where,
      order: orderBy,
      take,
      skip,
      solcomId: solcomId ? parseInt(solcomId, 10) : undefined,
    };

    return this.ordenCompraService.findAll(options);
  }

  @RequirePermissions(PERMISOS.ORDEN_COMPRA_VER)
  @Get(':id/pdf')
  async generatePdf(@Param('id', ParseIntPipe) id: number, @Res() response: Response) {
    const pdfBuffer = await this.ordenCompraService.generatePdf(id);

    response.header('Content-Type', 'application/pdf');
    response.header('Content-Disposition', `attachment; filename="OrdenCompra_${id}.pdf"`);

    response.send(pdfBuffer);
  }

  @RequirePermissions(PERMISOS.ORDEN_COMPRA_VER)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ordenCompraService.findOne(id);
  }

  @RequirePermissions(PERMISOS.ORDEN_COMPRA_EDITAR)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateOrdenCompraDto: UpdateOrdenCompraDto) {
    return this.ordenCompraService.update(id, updateOrdenCompraDto);
  }

  @RequirePermissions(PERMISOS.ORDEN_COMPRA_ELIMINAR)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ordenCompraService.remove(id);
  }

  @RequirePermissions(PERMISOS.ORDEN_COMPRA_CANCELAR)
  @Patch(':id/cancelar')
  cancelar(@Param('id', ParseIntPipe) id: number) {
    return this.ordenCompraService.cancelar(id);
  }

  @RequirePermissions(PERMISOS.ORDEN_COMPRA_EDITAR)
  @Patch('item/:itemId')
  updateItem(@Param('itemId', ParseIntPipe) itemId: number, @Body() updateData: any) {
    return this.ordenCompraService.updateItem(itemId, updateData);
  }
}
