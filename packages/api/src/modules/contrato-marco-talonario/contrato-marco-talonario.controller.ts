import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiKeyGuard } from '../auth/guards/api-key/api-key.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { ContratoMarcoTalonarioService } from './contrato-marco-talonario.service';
import { CreateContratoMarcoTalonarioDto } from './dto/create-contrato-marco-talonario.dto';
import { UpdateContratoMarcoTalonarioDto } from './dto/update-contrato-marco-talonario.dto';
import { PERMISOS } from '@/constants/permisos';
import { AuthorizationGuard } from '../auth/guards/authorization/authorization.guard';
import { RequirePermissions } from '../auth/decorators/require-permissions/require-permissions.decorator';

@Controller('contrato-marco-talonario')
@UseGuards(JwtAuthGuard, ApiKeyGuard, AuthorizationGuard)
export class ContratoMarcoTalonarioController {
  constructor(private readonly ContratoMarcoTalonarioService: ContratoMarcoTalonarioService) { }

  @RequirePermissions(PERMISOS.CONTRATO_MARCO_TALONARIO_CREAR)
  @Post()
  create(@Body() CreateContratoMarcoTalonarioDto: CreateContratoMarcoTalonarioDto) {
    return this.ContratoMarcoTalonarioService.create(CreateContratoMarcoTalonarioDto);
  }

  @RequirePermissions(PERMISOS.CONTRATO_MARCO_TALONARIO_VER)
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
    return this.ContratoMarcoTalonarioService.findAll(options);
  }

  @RequirePermissions(PERMISOS.CONTRATO_MARCO_TALONARIO_VER)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ContratoMarcoTalonarioService.findOne(id);
  }

  @RequirePermissions(PERMISOS.CONTRATO_MARCO_TALONARIO_EDITAR)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() UpdateContratoMarcoTalonarioDto: UpdateContratoMarcoTalonarioDto,
  ) {
    return this.ContratoMarcoTalonarioService.update(id, UpdateContratoMarcoTalonarioDto);
  }

  @RequirePermissions(PERMISOS.CONTRATO_MARCO_TALONARIO_ELIMINAR)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ContratoMarcoTalonarioService.remove(id);
  }
}
