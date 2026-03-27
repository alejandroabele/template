import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AfipService } from './afip.service';
import { ApiKeyGuard } from '../auth/guards/api-key/api-key.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { AuthorizationGuard } from '@/modules/auth/guards/authorization/authorization.guard';
import { PERMISOS } from '@/constants/permisos';
import { RequirePermissions } from '@/modules/auth/decorators/require-permissions/require-permissions.decorator';

@Controller('afip')
export class AfipController {
  constructor(private readonly afipService: AfipService) { }

  @RequirePermissions(PERMISOS.AFIP_CONSULTAR_PADRON)
  @UseGuards(JwtAuthGuard, ApiKeyGuard, AuthorizationGuard)
  @Get('padron')
  getPadron(@Query('cuit') cuit: string) {
    return this.afipService.getPadron(cuit);
  }

}
