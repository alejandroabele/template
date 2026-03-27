import { Controller, Get, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { EstadoComprasService } from './estado-compras.service';
import { ApiTags } from '@nestjs/swagger';
import { ApiKeyGuard } from '../auth/guards/api-key/api-key.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { AuthorizationGuard } from '../auth/guards/authorization/authorization.guard';

@ApiTags('estado-compras')
@Controller('estado-compras')
@UseGuards(JwtAuthGuard, ApiKeyGuard, AuthorizationGuard)
export class EstadoComprasController {
  constructor(private readonly estadoComprasService: EstadoComprasService) {}

  @Get()
  findAll(
    @Query('limit') take: number,
    @Query('skip') skip: number,
    @Query('filter') filter: string,
    @Query('order') order: string,
  ) {
    const where = filter ? JSON.parse(filter) : {};
    const orderBy = order ? JSON.parse(order) : {};

    const options = {
      where,
      order: orderBy,
      take,
      skip,
    };

    return this.estadoComprasService.findAll(options);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.estadoComprasService.findOne(id);
  }
}
