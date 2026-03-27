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
import { ContactoService } from './contacto.service';
import { CreateContactoDto } from './dto/create-contacto.dto';
import { UpdateContactoDto } from './dto/update-contacto.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { ApiKeyGuard } from '../auth/guards/api-key/api-key.guard';
import { AuthorizationGuard } from '../auth/guards/authorization/authorization.guard';
import { RequirePermissions } from '../auth/decorators/require-permissions/require-permissions.decorator';
import { PERMISOS } from '@/constants/permisos';

@Controller('contacto')
@UseGuards(JwtAuthGuard, ApiKeyGuard, AuthorizationGuard)
export class ContactoController {
  constructor(private readonly contactoService: ContactoService) {}

  @RequirePermissions(PERMISOS.CONTACTO_CREAR)
  @Post()
  create(@Body() createContactoDto: CreateContactoDto) {
    return this.contactoService.create(createContactoDto);
  }

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

    return this.contactoService.findAll(options);
  }

  @RequirePermissions(PERMISOS.CONTACTO_VER)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.contactoService.findOne(id);
  }

  @RequirePermissions(PERMISOS.CONTACTO_EDITAR)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateContactoDto: UpdateContactoDto,
  ) {
    return this.contactoService.update(id, updateContactoDto);
  }

  @RequirePermissions(PERMISOS.CONTACTO_ELIMINAR)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.contactoService.remove(id);
  }
}
