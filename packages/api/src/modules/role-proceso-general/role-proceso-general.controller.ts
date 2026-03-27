import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiKeyGuard } from '../auth/guards/api-key/api-key.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { RoleProcesoGeneralService } from './role-proceso-general.service';
import { CreateRoleProcesoGeneralDto } from './dto/create-role-proceso-general.dto';
import { UpdateRoleProcesoGeneralDto } from './dto/update-role-proceso-general.dto';
import { PERMISOS } from '@/constants/permisos';
import { AuthorizationGuard } from '../auth/guards/authorization/authorization.guard';
import { RequirePermissions } from '../auth/decorators/require-permissions/require-permissions.decorator';

@Controller('role-proceso-general')
@UseGuards(JwtAuthGuard, ApiKeyGuard, AuthorizationGuard)
export class RoleProcesoGeneralController {
  constructor(private readonly roleProcesoGeneralService: RoleProcesoGeneralService) { }

  @RequirePermissions(PERMISOS.ROLE_PROCESO_GENERAL_CREAR)
  @Post()
  create(@Body() createRoleProcesoGeneralDto: CreateRoleProcesoGeneralDto) {
    return this.roleProcesoGeneralService.create(createRoleProcesoGeneralDto);
  }

  @RequirePermissions(PERMISOS.ROLE_PROCESO_GENERAL_VER)
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

    return this.roleProcesoGeneralService.findAll(options);
  }

  @RequirePermissions(PERMISOS.ROLE_PROCESO_GENERAL_VER)
  @Get('by-role/:roleId')
  findByRoleId(@Param('roleId', ParseIntPipe) roleId: number) {
    return this.roleProcesoGeneralService.findByRoleId(roleId);
  }

  @RequirePermissions(PERMISOS.ROLE_PROCESO_GENERAL_VER)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.roleProcesoGeneralService.findOne(id);
  }

  @RequirePermissions(PERMISOS.ROLE_PROCESO_GENERAL_EDITAR)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateRoleProcesoGeneralDto: UpdateRoleProcesoGeneralDto) {
    return this.roleProcesoGeneralService.update(id, updateRoleProcesoGeneralDto);
  }

  @RequirePermissions(PERMISOS.ROLE_PROCESO_GENERAL_ELIMINAR)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.roleProcesoGeneralService.remove(id);
  }

  @RequirePermissions(PERMISOS.ROLE_PROCESO_GENERAL_ELIMINAR)
  @Delete('by-role-proceso/:roleId/:procesoGeneralId')
  removeByRoleAndProceso(
    @Param('roleId', ParseIntPipe) roleId: number,
    @Param('procesoGeneralId', ParseIntPipe) procesoGeneralId: number
  ) {
    return this.roleProcesoGeneralService.removeByRoleAndProceso(roleId, procesoGeneralId);
  }
}
