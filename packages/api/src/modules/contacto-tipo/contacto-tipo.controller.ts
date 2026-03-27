import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ContactoTipoService } from './contacto-tipo.service';
import { CreateContactoTipoDto } from './dto/create-contacto-tipo.dto';
import { UpdateContactoTipoDto } from './dto/update-contacto-tipo.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { ApiKeyGuard } from '../auth/guards/api-key/api-key.guard';
import { AuthorizationGuard } from '../auth/guards/authorization/authorization.guard';
import { RequirePermissions } from '../auth/decorators/require-permissions/require-permissions.decorator';
import { PERMISOS } from '@/constants/permisos';

@Controller('contacto-tipo')
@UseGuards(JwtAuthGuard, ApiKeyGuard, AuthorizationGuard)
export class ContactoTipoController {
  constructor(private readonly contactoTipoService: ContactoTipoService) {}

  @RequirePermissions(PERMISOS.CONTACTO_TIPO_CREAR)
  @Post()
  create(@Body() createContactoTipoDto: CreateContactoTipoDto) {
    return this.contactoTipoService.create(createContactoTipoDto);
  }

  @RequirePermissions(PERMISOS.CONTACTO_TIPO_VER)
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

    return this.contactoTipoService.findAll(options);
  }

  @RequirePermissions(PERMISOS.CONTACTO_TIPO_VER)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.contactoTipoService.findOne(id);
  }

  @RequirePermissions(PERMISOS.CONTACTO_TIPO_EDITAR)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateContactoTipoDto: UpdateContactoTipoDto) {
    return this.contactoTipoService.update(id, updateContactoTipoDto);
  }

  @RequirePermissions(PERMISOS.CONTACTO_TIPO_ELIMINAR)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.contactoTipoService.remove(id);
  }
}
