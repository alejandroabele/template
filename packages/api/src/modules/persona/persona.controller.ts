import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiKeyGuard } from '../auth/guards/api-key/api-key.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { AuthorizationGuard } from '../auth/guards/authorization/authorization.guard';
import { RequirePermissions } from '../auth/decorators/require-permissions/require-permissions.decorator';
import { PERMISOS } from '@/constants/permisos';
import { PersonaService } from './persona.service';
import { CreatePersonaDto } from './dto/create-persona.dto';
import { UpdatePersonaDto } from './dto/update-persona.dto';

@Controller('persona')
@UseGuards(JwtAuthGuard, ApiKeyGuard, AuthorizationGuard)
export class PersonaController {
  constructor(private readonly personaService: PersonaService) {}

  @RequirePermissions(PERMISOS.PERSONA_CREAR)
  @Post()
  create(@Body() createPersonaDto: CreatePersonaDto) {
    return this.personaService.create(createPersonaDto);
  }

  @RequirePermissions(PERMISOS.PERSONA_VER)
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

    return this.personaService.findAll(options);
  }

  @RequirePermissions(PERMISOS.JORNADA_VER)
  @Get('por-dni/:dni')
  findByDni(@Param('dni') dni: string) {
    return this.personaService.findByDni(dni);
  }

  @RequirePermissions(PERMISOS.PERSONA_VER)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.personaService.findOne(id);
  }

  @RequirePermissions(PERMISOS.PERSONA_EDITAR)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePersonaDto: UpdatePersonaDto,
  ) {
    return this.personaService.update(id, updatePersonaDto);
  }

  @RequirePermissions(PERMISOS.PERSONA_ELIMINAR)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.personaService.remove(id);
  }
}
