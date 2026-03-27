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
import { BancoService } from './banco.service';
import { CreateBancoDto } from './dto/create-banco.dto';
import { UpdateBancoDto } from './dto/update-banco.dto';
import { TransferirBancoDto } from './dto/transferir-banco.dto';
import { ApiKeyGuard } from '../auth/guards/api-key/api-key.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { AuthorizationGuard } from '../auth/guards/authorization/authorization.guard';
import { RequirePermissions } from '../auth/decorators/require-permissions/require-permissions.decorator';
import { PERMISOS } from '@/constants/permisos';

@Controller('bancos')
@UseGuards(JwtAuthGuard, ApiKeyGuard, AuthorizationGuard)
export class BancoController {
  constructor(private readonly bancoService: BancoService) { }

  @RequirePermissions(PERMISOS.BANCOS_CREAR)
  @Post()
  create(@Body() createBancoDto: CreateBancoDto) {
    return this.bancoService.create(createBancoDto);
  }

  @RequirePermissions(PERMISOS.BANCOS_VER)
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

    return this.bancoService.findAll(options);
  }

  @RequirePermissions(PERMISOS.BANCOS_VER)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bancoService.findOne(id);
  }

  @RequirePermissions(PERMISOS.BANCOS_EDITAR)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBancoDto: UpdateBancoDto,
  ) {
    return this.bancoService.update(id, updateBancoDto);
  }

  @RequirePermissions(PERMISOS.BANCOS_ELIMINAR)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.bancoService.remove(id);
  }

  @RequirePermissions(PERMISOS.BANCOS_TRANSFERIR)
  @Post('transferir')
  transferir(@Body() transferirBancoDto: TransferirBancoDto) {
    return this.bancoService.transferir(transferirBancoDto);
  }
}
