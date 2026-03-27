import { Controller, Post, Get, Body, Query, UseGuards } from '@nestjs/common';
import { RegistroLeidoService } from './registro-leido.service';
import { CreateRegistroLeidoDto } from './dto/create-registro-leido.dto';
import { ApiKeyGuard } from '../auth/guards/api-key/api-key.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { AuthorizationGuard } from '../auth/guards/authorization/authorization.guard';

@Controller('registro-leido')
@UseGuards(JwtAuthGuard, ApiKeyGuard, AuthorizationGuard)
export class RegistroLeidoController {
  constructor(private readonly registroLeidoService: RegistroLeidoService) { }

  @Post()
  async marcarComoLeido(@Body() createDto: CreateRegistroLeidoDto) {
    return this.registroLeidoService.marcarComoLeido(createDto.modelo, createDto.modeloId);
  }

  @Get('verificar')
  async verificarLectura(@Query('modelo') modelo: string, @Query('modeloId') modeloId: string) {
    const leido = await this.registroLeidoService.verificarLecturaUsuario(modelo, Number(modeloId));
    return { leido };
  }

  @Get('lista')
  async obtenerListaLeidos(@Query('modelo') modelo: string) {
    const ids = await this.registroLeidoService.obtenerRegistrosLeidos(modelo);
    return { ids };
  }

  @Get('fecha')
  async obtenerFechaLectura(@Query('modelo') modelo: string, @Query('modeloId') modeloId: string) {
    const fecha = await this.registroLeidoService.obtenerFechaLectura(modelo, Number(modeloId));
    return { fecha };
  }
}
