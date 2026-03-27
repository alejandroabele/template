import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { ApiKeyGuard } from '../auth/guards/api-key/api-key.guard';
import { OfertaAprobacionService } from './oferta-aprobacion.service';
import { CreateOfertaAprobacionDto } from './dto/create-oferta-aprobacion.dto';
import { UpdateOfertaAprobacionDto } from './dto/update-oferta-aprobacion.dto';
import { AprobarOfertaAprobacionDto } from './dto/aprobar-oferta-aprobacion.dto';
import { RechazarOfertaAprobacionDto } from './dto/rechazar-oferta-aprobacion.dto';

@Controller('oferta-aprobacion')
@UseGuards(JwtAuthGuard, ApiKeyGuard)
export class OfertaAprobacionController {
  constructor(private readonly ofertaAprobacionService: OfertaAprobacionService) {}

  @Post()
  create(@Body() createOfertaAprobacionDto: CreateOfertaAprobacionDto) {
    return this.ofertaAprobacionService.create(createOfertaAprobacionDto);
  }

  @Get('oferta/:ofertaId')
  findByOferta(@Param('ofertaId', ParseIntPipe) ofertaId: number) {
    return this.ofertaAprobacionService.findByOferta(ofertaId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ofertaAprobacionService.findOne(id);
  }

  @Post(':id/aprobar')
  aprobar(@Param('id', ParseIntPipe) id: number, @Body() aprobarDto: AprobarOfertaAprobacionDto) {
    return this.ofertaAprobacionService.aprobar(id, aprobarDto);
  }

  @Post(':id/rechazar')
  rechazar(@Param('id', ParseIntPipe) id: number, @Body() rechazarDto: RechazarOfertaAprobacionDto) {
    return this.ofertaAprobacionService.rechazar(id, rechazarDto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateOfertaAprobacionDto: UpdateOfertaAprobacionDto) {
    return this.ofertaAprobacionService.update(id, updateOfertaAprobacionDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ofertaAprobacionService.remove(id);
  }
}
