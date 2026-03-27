import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiKeyGuard } from '../auth/guards/api-key/api-key.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { AuthorizationGuard } from '../auth/guards/authorization/authorization.guard';
import { RequirePermissions } from '../auth/decorators/require-permissions/require-permissions.decorator';
import { PERMISOS } from '@/constants/permisos';
import { JornadaService } from './jornada.service';
import { CreateJornadaDto } from './dto/create-jornada.dto';
import { UpdateJornadaDto } from './dto/update-jornada.dto';
import { AsociarEquipamientoDto } from './dto/asociar-equipamiento.dto';
import { IniciarPorOtDto } from './dto/iniciar-por-ot.dto';

@Controller('jornada')
@UseGuards(JwtAuthGuard, ApiKeyGuard, AuthorizationGuard)
export class JornadaController {
  constructor(private readonly jornadaService: JornadaService) { }

  @RequirePermissions(PERMISOS.JORNADA_CREAR)
  @Post()
  create(@Body() createJornadaDto: CreateJornadaDto) {
    return this.jornadaService.create(createJornadaDto);
  }

  @RequirePermissions(PERMISOS.JORNADA_VER)
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

    return this.jornadaService.findAll(options);
  }

  // Rutas literales GET deben ir antes que GET :id para evitar conflictos
  @RequirePermissions(PERMISOS.JORNADA_VER)
  @Get('mis-asignaciones')
  misAsignaciones(
    @Query('dni') dni: string,
    @Query('fecha') fecha?: string,
  ) {
    return this.jornadaService.misAsignaciones(dni, fecha);
  }

  @RequirePermissions(PERMISOS.JORNADA_VER)
  @Get('en-curso')
  enCurso() {
    return this.jornadaService.enCurso();
  }

  @RequirePermissions(PERMISOS.JORNADA_INICIAR)
  @Post('iniciar-por-ot')
  iniciarPorOt(@Body() iniciarPorOtDto: IniciarPorOtDto) {
    return this.jornadaService.iniciarPorOt(iniciarPorOtDto);
  }

  @RequirePermissions(PERMISOS.JORNADA_VER)
  @Get('ot/:id/trabajos')
  trabajosDisponiblesPorOt(@Param('id', ParseIntPipe) id: number) {
    return this.jornadaService.trabajosDisponiblesPorOt(id);
  }

  @RequirePermissions(PERMISOS.JORNADA_VER)
  @Get('estadisticas')
  estadisticas(
    @Query('desde') desde?: string,
    @Query('hasta') hasta?: string,
  ) {
    return this.jornadaService.estadisticas(desde, hasta);
  }

  @RequirePermissions(PERMISOS.JORNADA_VER)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.jornadaService.findOne(id);
  }

  @RequirePermissions(PERMISOS.JORNADA_EDITAR)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateJornadaDto: UpdateJornadaDto,
  ) {
    return this.jornadaService.update(id, updateJornadaDto);
  }

  @RequirePermissions(PERMISOS.JORNADA_ELIMINAR)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.jornadaService.remove(id);
  }

  @RequirePermissions(PERMISOS.JORNADA_EDITAR)
  @Patch(':id/cancelar')
  cancelar(
    @Param('id', ParseIntPipe) id: number,
    @Body('motivo') motivo?: string,
  ) {
    return this.jornadaService.cancelar(id, motivo);
  }

  @RequirePermissions(PERMISOS.JORNADA_EDITAR)
  @Patch(':id/flota')
  updateFlota(
    @Param('id', ParseIntPipe) id: number,
    @Body() asociarEquipamientoDto: AsociarEquipamientoDto,
  ) {
    return this.jornadaService.updateFlota(id, asociarEquipamientoDto.equipamientoIds);
  }

  @RequirePermissions(PERMISOS.JORNADA_INICIAR)
  @Patch('persona/:id/iniciar')
  iniciarAsignacion(@Param('id', ParseIntPipe) id: number) {
    return this.jornadaService.iniciarAsignacion(id);
  }

  @RequirePermissions(PERMISOS.JORNADA_FINALIZAR)
  @Patch('persona/:id/finalizar')
  finalizarAsignacion(@Param('id', ParseIntPipe) id: number) {
    return this.jornadaService.finalizarAsignacion(id);
  }
}
