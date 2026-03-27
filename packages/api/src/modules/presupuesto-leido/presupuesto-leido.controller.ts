import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { PresupuestoLeidoService } from './presupuesto-leido.service';
import { ApiKeyGuard } from '../auth/guards/api-key/api-key.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { AuthorizationGuard } from '../auth/guards/authorization/authorization.guard';

@Controller('presupuesto-leido')
@UseGuards(JwtAuthGuard, ApiKeyGuard, AuthorizationGuard)
export class PresupuestoLeidoController {
  constructor(private readonly presupuestoLeidoService: PresupuestoLeidoService) { }

  @Post()
  async marcarComoLeido(@Body() body: { presupuestoId: number }) {
    return this.presupuestoLeidoService.marcarComoLeido(body.presupuestoId);
  }


}
