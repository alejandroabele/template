import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PresupuestoManoDeObraService } from './presupuesto-mano-de-obra.service';
import { CreatePresupuestoManoDeObraDto } from './dto/create-presupuesto-mano-de-obra.dto';
import { UpdatePresupuestoManoDeObraDto } from './dto/update-presupuesto-mano-de-obra.dto';
import { RequirePermissions } from '../auth/decorators/require-permissions/require-permissions.decorator';
import { ApiKeyGuard } from '../auth/guards/api-key/api-key.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { PERMISOS } from '@/constants/permisos';
import { AuthorizationGuard } from '../auth/guards/authorization/authorization.guard';



@Controller('presupuesto-mano-de-obra')
@UseGuards(JwtAuthGuard, ApiKeyGuard, AuthorizationGuard)
export class PresupuestoManoDeObraController {
  constructor(private readonly presupuestoManoDeObraService: PresupuestoManoDeObraService) { }

  @Post()
  @RequirePermissions(PERMISOS.PRESUPUESTO_MANO_DE_OBRA_CREAR)
  create(@Body() createPresupuestoManoDeObraDto: CreatePresupuestoManoDeObraDto) {
    return this.presupuestoManoDeObraService.create(createPresupuestoManoDeObraDto);
  }

  @Get()
  @RequirePermissions(PERMISOS.PRESUPUESTO_MANO_DE_OBRA_VER)
  findAll() {
    return this.presupuestoManoDeObraService.findAll();
  }

  @Get(':id')
  @RequirePermissions(PERMISOS.PRESUPUESTO_MANO_DE_OBRA_VER)
  findOne(@Param('id') id: string) {
    return this.presupuestoManoDeObraService.findOne(+id);
  }

  @Patch(':id')
  @RequirePermissions(PERMISOS.PRESUPUESTO_MANO_DE_OBRA_EDITAR)
  update(@Param('id') id: string, @Body() updatePresupuestoManoDeObraDto: UpdatePresupuestoManoDeObraDto) {
    return this.presupuestoManoDeObraService.update(+id, updatePresupuestoManoDeObraDto);
  }

  @Delete(':id')
  @RequirePermissions(PERMISOS.PRESUPUESTO_MANO_DE_OBRA_ELIMINAR)
  remove(@Param('id') id: string) {
    return this.presupuestoManoDeObraService.remove(+id);
  }
}
