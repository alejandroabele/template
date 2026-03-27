import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiKeyGuard } from '../auth/guards/api-key/api-key.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { AuthorizationGuard } from '../auth/guards/authorization/authorization.guard';
import { RequirePermissions } from '../auth/decorators/require-permissions/require-permissions.decorator';
import { PERMISOS } from '@/constants/permisos';
import { RefrigerioService } from './refrigerio.service';
import { CreateRefrigerioDto } from './dto/create-refrigerio.dto';

@Controller('refrigerio')
@UseGuards(JwtAuthGuard, ApiKeyGuard, AuthorizationGuard)
export class RefrigerioController {
  constructor(private readonly refrigerioService: RefrigerioService) { }

  @RequirePermissions(PERMISOS.JORNADA_VER)
  @Get('en-curso')
  enCurso() {
    return this.refrigerioService.enCurso();
  }

  @RequirePermissions(PERMISOS.JORNADA_VER)
  @Get('activo')
  activo(@Query('personaId', ParseIntPipe) personaId: number) {
    return this.refrigerioService.activo(personaId);
  }

  @RequirePermissions(PERMISOS.JORNADA_VER)
  @Get('estadisticas')
  estadisticas(
    @Query('desde') desde?: string,
    @Query('hasta') hasta?: string,
  ) {
    return this.refrigerioService.estadisticas(desde, hasta);
  }

  @RequirePermissions(PERMISOS.JORNADA_VER)
  @Get()
  historial(
    @Query('personaId', ParseIntPipe) personaId: number,
    @Query('fecha') fecha?: string,
  ) {
    return this.refrigerioService.historial(personaId, fecha);
  }


  @RequirePermissions(PERMISOS.REFRIGERIO_INICIAR)
  @Post('iniciar')
  iniciar(@Body() dto: CreateRefrigerioDto) {
    return this.refrigerioService.iniciar(dto);
  }

  @RequirePermissions(PERMISOS.REFRIGERIO_FINALIZAR)
  @Patch(':id/finalizar')
  finalizar(@Param('id', ParseIntPipe) id: number) {
    return this.refrigerioService.finalizar(id);
  }
}
