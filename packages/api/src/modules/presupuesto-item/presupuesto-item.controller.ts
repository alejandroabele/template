import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { PresupuestoItemService } from './presupuesto-item.service';
import { CreatePresupuestoItemDto } from './dto/create-presupuesto-item.dto';
import { UpdatePresupuestoItemDto } from './dto/update-presupuesto-item.dto';
import { ApiKeyGuard } from '../auth/guards/api-key/api-key.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { PERMISOS } from '@/constants/permisos';
import { AuthorizationGuard } from '../auth/guards/authorization/authorization.guard';
import { RequirePermissions } from '../auth/decorators/require-permissions/require-permissions.decorator';



@Controller('presupuesto-item')
@UseGuards(JwtAuthGuard, ApiKeyGuard, AuthorizationGuard)
export class PresupuestoItemController {
  constructor(private readonly presupuestoItemService: PresupuestoItemService) { }

  @RequirePermissions(PERMISOS.PRESUPUESTO_ITEM_CREAR)
  @Post()
  create(@Body() createPresupuestoItemDto: CreatePresupuestoItemDto) {
    return this.presupuestoItemService.create(createPresupuestoItemDto);
  }

  @RequirePermissions(PERMISOS.PRESUPUESTO_ITEM_VER)
  @Get()
  findAll(
    @Query('limit') take: number,
    @Query('skip') skip: number,
    @Query('filter') filter: string,
    @Query('order') order: string,
  ) {
    const where = filter ? JSON.parse(filter) : [];
    const orderBy = order
      ? JSON.parse(order)
      : {};
    const options = {
      where,
      order: orderBy,
      take,
      skip,
    };
    return this.presupuestoItemService.findAll(options);
  }
  @RequirePermissions(PERMISOS.PRESUPUESTO_ITEM_VER)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.presupuestoItemService.findOne(+id);
  }
  @RequirePermissions(PERMISOS.PRESUPUESTO_ITEM_EDITAR)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePresupuestoItemDto: UpdatePresupuestoItemDto) {
    return this.presupuestoItemService.update(+id, updatePresupuestoItemDto);
  }

  @RequirePermissions(PERMISOS.PRESUPUESTO_ITEM_ELIMINAR)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.presupuestoItemService.remove(+id);
  }
}
