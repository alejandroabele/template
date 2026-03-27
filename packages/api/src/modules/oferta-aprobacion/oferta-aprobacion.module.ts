import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfertaAprobacionService } from './oferta-aprobacion.service';
import { OfertaAprobacionController } from './oferta-aprobacion.controller';
import { OfertaAprobacion } from './entities/oferta-aprobacion.entity';
import { AprobacionOfertaTipo } from './entities/aprobacion-oferta-tipo.entity';
import { Oferta } from '@/modules/oferta/entities/oferta.entity';
import { EstadoCompras } from '@/modules/estado-compras/entities/estado-compras.entity';
import { NotificacionModule } from '@/modules/notificacion/notificacion.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OfertaAprobacion, AprobacionOfertaTipo, Oferta, EstadoCompras]),
    NotificacionModule
  ],
  controllers: [OfertaAprobacionController],
  providers: [OfertaAprobacionService],
  exports: [OfertaAprobacionService, TypeOrmModule],
})
export class OfertaAprobacionModule {}
