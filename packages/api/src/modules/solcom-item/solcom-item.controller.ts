import { Body, Controller, Get, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiKeyGuard } from '../auth/guards/api-key/api-key.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { AuthorizationGuard } from '../auth/guards/authorization/authorization.guard';
import { RequirePermissions } from '../auth/decorators/require-permissions/require-permissions.decorator';
import { PERMISOS } from '@/constants/permisos';
import { SolcomService } from '../solcom/solcom.service';

@Controller('solcom-items')
@UseGuards(JwtAuthGuard, ApiKeyGuard, AuthorizationGuard)
export class SolcomItemController {
  constructor(private readonly solcomService: SolcomService) { }

  @RequirePermissions(PERMISOS.SOLCOM_VER)
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

    return this.solcomService.findAllItems(options);
  }

  @RequirePermissions(PERMISOS.SOLCOM_ASIGNAR)
  @Patch('asignar')
  asignar(@Body('itemIds') itemIds: number | number[]) {
    // Si es un solo ID, convertir a array
    const ids = Array.isArray(itemIds) ? itemIds : [itemIds];
    return this.solcomService.asignarItems(ids);
  }
}
