import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BancoSaldoService } from './banco-saldo.service';
import { CreateBancoSaldoDto } from './dto/create-banco-saldo.dto';
import { UpdateBancoSaldoDto } from './dto/update-banco-saldo.dto';
import { ActualizarSaldosHoyDto } from './dto/actualizar-saldos-hoy.dto';
import { ApiKeyGuard } from '../auth/guards/api-key/api-key.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { PERMISOS } from '@/constants/permisos';
import { RequirePermissions } from '../auth/decorators/require-permissions/require-permissions.decorator';
import { AuthorizationGuard } from '../auth/guards/authorization/authorization.guard';

@Controller('banco-saldos')
@UseGuards(JwtAuthGuard, ApiKeyGuard, AuthorizationGuard)
export class BancoSaldoController {
  constructor(private readonly bancoSaldoService: BancoSaldoService) { }

  @RequirePermissions(PERMISOS.BANCOS_SALDO_CREAR)
  @Post()
  create(@Body() createBancoSaldoDto: CreateBancoSaldoDto) {
    return this.bancoSaldoService.create(createBancoSaldoDto);
  }

  @RequirePermissions(PERMISOS.BANCOS_SALDO_CREAR)
  @Post('actualizar-saldos-hoy')
  actualizarSaldosHoy(@Body() actualizarSaldosHoyDto: ActualizarSaldosHoyDto) {
    return this.bancoSaldoService.actualizarSaldosHoy(actualizarSaldosHoyDto.saldos);
  }

  @RequirePermissions(PERMISOS.BANCOS_SALDO_VER)
  @Get('ultimos-saldos')
  getUltimosSaldos() {
    return this.bancoSaldoService.getUltimosSaldos();
  }

  @RequirePermissions(PERMISOS.BANCOS_SALDO_VER)
  @Get('saldos-por-fechas')
  getSaldosPorFechas(@Query('fechas') fechas: string) {
    const fechasArray = fechas ? JSON.parse(fechas) : [];
    return this.bancoSaldoService.getSaldosPorFechas(fechasArray);
  }

  @RequirePermissions(PERMISOS.BANCOS_SALDO_VER)
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

    return this.bancoSaldoService.findAll(options);
  }

  @RequirePermissions(PERMISOS.BANCOS_SALDO_VER)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bancoSaldoService.findOne(id);
  }

  @RequirePermissions(PERMISOS.BANCOS_SALDO_EDITAR)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBancoSaldoDto: UpdateBancoSaldoDto,
  ) {
    return this.bancoSaldoService.update(id, updateBancoSaldoDto);
  }

  @RequirePermissions(PERMISOS.BANCOS_SALDO_ELIMINAR)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.bancoSaldoService.remove(id);
  }
}
