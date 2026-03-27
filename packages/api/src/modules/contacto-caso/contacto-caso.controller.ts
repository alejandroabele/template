import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ContactoCasoService } from './contacto-caso.service';
import { CreateContactoCasoDto } from './dto/create-contacto-caso.dto';
import { UpdateContactoCasoDto } from './dto/update-contacto-caso.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { ApiKeyGuard } from '../auth/guards/api-key/api-key.guard';
import { AuthorizationGuard } from '../auth/guards/authorization/authorization.guard';
import { RequirePermissions } from '../auth/decorators/require-permissions/require-permissions.decorator';
import { PERMISOS } from '@/constants/permisos';

@Controller('contacto-caso')
@UseGuards(JwtAuthGuard, ApiKeyGuard, AuthorizationGuard)
export class ContactoCasoController {
  constructor(private readonly contactoCasoService: ContactoCasoService) {}

  @RequirePermissions(PERMISOS.CONTACTO_CASO_CREAR)
  @Post()
  create(@Body() createContactoCasoDto: CreateContactoCasoDto) {
    return this.contactoCasoService.create(createContactoCasoDto);
  }

  @RequirePermissions(PERMISOS.CONTACTO_CASO_VER)
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

    return this.contactoCasoService.findAll(options);
  }

  @RequirePermissions(PERMISOS.CONTACTO_CASO_VER)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.contactoCasoService.findOne(id);
  }

  @RequirePermissions(PERMISOS.CONTACTO_CASO_EDITAR)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateContactoCasoDto: UpdateContactoCasoDto) {
    return this.contactoCasoService.update(id, updateContactoCasoDto);
  }

  @RequirePermissions(PERMISOS.CONTACTO_CASO_ELIMINAR)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.contactoCasoService.remove(id);
  }
}
