import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ContactoProximoService } from './contacto-proximo.service';
import { CreateContactoProximoDto } from './dto/create-contacto-proximo.dto';
import { UpdateContactoProximoDto } from './dto/update-contacto-proximo.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { ApiKeyGuard } from '../auth/guards/api-key/api-key.guard';
import { AuthorizationGuard } from '../auth/guards/authorization/authorization.guard';
import { RequirePermissions } from '../auth/decorators/require-permissions/require-permissions.decorator';
import { PERMISOS } from '@/constants/permisos';

@Controller('contacto-proximo')
@UseGuards(JwtAuthGuard, ApiKeyGuard, AuthorizationGuard)
export class ContactoProximoController {
  constructor(private readonly contactoProximoService: ContactoProximoService) {}

  @RequirePermissions(PERMISOS.CONTACTO_VER)
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

    return this.contactoProximoService.findAll(options);
  }

  @RequirePermissions(PERMISOS.CONTACTO_VER)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.contactoProximoService.findOne(id);
  }

  @RequirePermissions(PERMISOS.CONTACTO_CREAR)
  @Post()
  create(@Body() createDto: CreateContactoProximoDto) {
    return this.contactoProximoService.create(createDto);
  }

  @RequirePermissions(PERMISOS.CONTACTO_EDITAR)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateContactoProximoDto) {
    return this.contactoProximoService.update(id, updateDto);
  }

  @RequirePermissions(PERMISOS.CONTACTO_ELIMINAR)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.contactoProximoService.remove(id);
  }
}
