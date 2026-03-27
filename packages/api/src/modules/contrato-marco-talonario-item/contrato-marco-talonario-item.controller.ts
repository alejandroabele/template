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
import { ContratoMarcoTalonarioItemService } from './contrato-marco-talonario-item.service';
import { CreateContratoMarcoTalonarioItemDto } from './dto/create-contrato-marco-talonario-item.dto';
import { UpdateContratoMarcoTalonarioItemDto } from './dto/update-contrato-marco-talonario-item.dto';
import { AuthorizationGuard } from '../auth/guards/authorization/authorization.guard';
import { PERMISOS } from '@/constants/permisos';
import { RequirePermissions } from '../auth/decorators/require-permissions/require-permissions.decorator';

@Controller('contrato-marco-talonario-item')
@UseGuards(JwtAuthGuard, ApiKeyGuard, AuthorizationGuard)
export class ContratoMarcoTalonarioItemController {
  constructor(private readonly ContratoMarcoTalonarioItemService: ContratoMarcoTalonarioItemService) { }

  @RequirePermissions(PERMISOS.CONTRATO_MARCO_TALONARIO_CREAR)
  @Post()
  create(@Body() CreateContratoMarcoTalonarioItemDto: CreateContratoMarcoTalonarioItemDto) {
    return this.ContratoMarcoTalonarioItemService.create(CreateContratoMarcoTalonarioItemDto);
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
    return this.ContratoMarcoTalonarioItemService.findAll(options);
  }

  @RequirePermissions(PERMISOS.CONTRATO_MARCO_TALONARIO_VER)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ContratoMarcoTalonarioItemService.findOne(id);
  }

  @RequirePermissions(PERMISOS.CONTRATO_MARCO_TALONARIO_EDITAR)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() UpdateContratoMarcoTalonarioItemDto: UpdateContratoMarcoTalonarioItemDto,
  ) {
    return this.ContratoMarcoTalonarioItemService.update(id, UpdateContratoMarcoTalonarioItemDto);
  }

  @RequirePermissions(PERMISOS.CONTRATO_MARCO_TALONARIO_ELIMINAR)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ContratoMarcoTalonarioItemService.remove(id);
  }
}
