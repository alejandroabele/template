import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { CobroService } from './cobro.service';
import { CreateCobroDto } from './dto/create-cobro.dto';
import { UpdateCobroDto } from './dto/update-cobro.dto';
import { CreateCobroMasivoDto } from './dto/create-cobro-masivo.dto';
import { PERMISOS } from '@/constants/permisos';
import { RequirePermissions } from '../auth/decorators/require-permissions/require-permissions.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { ApiKeyGuard } from '../auth/guards/api-key/api-key.guard';
import { AuthorizationGuard } from '../auth/guards/authorization/authorization.guard';

@Controller('cobro')
@UseGuards(JwtAuthGuard, ApiKeyGuard, AuthorizationGuard)
export class CobroController {
  constructor(private readonly cobroService: CobroService) {}

  @RequirePermissions(PERMISOS.COBRO_CREAR)
  @Post()
  create(@Body() createCobroDto: CreateCobroDto) {
    return this.cobroService.create(createCobroDto);
  }

  @RequirePermissions(PERMISOS.COBRO_CREAR)
  @Post('masivo')
  createMasivo(@Body() createCobroMasivoDto: CreateCobroMasivoDto) {
    return this.cobroService.createCobroMasivo(createCobroMasivoDto);
  }

  @RequirePermissions(PERMISOS.COBRO_VER)
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

    return this.cobroService.findAll(options);
  }

  @RequirePermissions(PERMISOS.COBRO_VER)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cobroService.findOne(id);
  }

  @RequirePermissions(PERMISOS.COBRO_EDITAR)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCobroDto: UpdateCobroDto,
  ) {
    return this.cobroService.update(id, updateCobroDto);
  }

  @RequirePermissions(PERMISOS.COBRO_ELIMINAR)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.cobroService.remove(id);
  }
}
