import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Res, UseGuards } from '@nestjs/common';
import { ApiKeyGuard } from '../auth/guards/api-key/api-key.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { SolcomService } from './solcom.service';
import { CreateSolcomDto } from './dto/create-solcom.dto';
import { UpdateSolcomDto } from './dto/update-solcom.dto';
import { PERMISOS } from '@/constants/permisos';
import { AuthorizationGuard } from '../auth/guards/authorization/authorization.guard';
import { RequirePermissions } from '../auth/decorators/require-permissions/require-permissions.decorator';
import { Response } from 'express';

@Controller('solcom')
@UseGuards(JwtAuthGuard, ApiKeyGuard, AuthorizationGuard)
export class SolcomController {
  constructor(private readonly solcomService: SolcomService) { }

  @RequirePermissions(PERMISOS.SOLCOM_CREAR)
  @Post()
  create(@Body() createSolcomDto: CreateSolcomDto) {
    return this.solcomService.create(createSolcomDto);
  }

  @RequirePermissions(PERMISOS.SOLCOM_VER)
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

    return this.solcomService.findAll(options);
  }

  @RequirePermissions(PERMISOS.SOLCOM_VER)
  @Post(':id/pdf')
  async generatePdf(
    @Param('id', ParseIntPipe) id: number,
    @Body('descripcionPdf') descripcionPdf: string,
    @Res() response: Response
  ) {
    const pdfBuffer = await this.solcomService.generatePdf(id, descripcionPdf);

    response.header('Content-Type', 'application/pdf');
    response.header('Content-Disposition', `attachment; filename="SOLCOM_${id}.pdf"`);

    response.send(pdfBuffer);
  }

  @RequirePermissions(PERMISOS.SOLCOM_VER)
  @Get(':id/items')
  findItems(@Param('id', ParseIntPipe) id: number) {
    return this.solcomService.findItems(id);
  }

  @RequirePermissions(PERMISOS.SOLCOM_VER)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.solcomService.findOne(id);
  }

  @RequirePermissions(PERMISOS.SOLCOM_EDITAR)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateSolcomDto: UpdateSolcomDto) {
    return this.solcomService.update(id, updateSolcomDto);
  }

  @RequirePermissions(PERMISOS.SOLCOM_ELIMINAR)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.solcomService.remove(id);
  }

  @RequirePermissions(PERMISOS.SOLCOM_FINALIZAR)
  @Patch(':id/finalizar')
  finalizar(@Param('id', ParseIntPipe) id: number) {
    return this.solcomService.finalizar(id);
  }

  @RequirePermissions(PERMISOS.SOLCOM_ASIGNAR)
  @Patch(':id/asignar')
  asignar(@Param('id', ParseIntPipe) id: number) {
    return this.solcomService.asignar(id);
  }

  @RequirePermissions(PERMISOS.SOLCOM_MODIFICAR_ESTADO)
  @Patch(':id/modificar-estado')
  modificarEstado(@Param('id', ParseIntPipe) id: number, @Body('estadoId') estadoId: number) {
    return this.solcomService.modificarEstado(id, estadoId);
  }
}
