import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfertaController } from './oferta.controller';
import { OfertaService } from './oferta.service';
import { Oferta } from './entities/oferta.entity';
import { OfertaItem } from './entities/oferta-item.entity';
import { EstadoCompras } from '../estado-compras/entities/estado-compras.entity';
import { Archivo } from '@/modules/archivo/entities/archivo.entity';
import { SolcomItem } from '../solcom/entities/solcom-item.entity';
import { OfertaAprobacionModule } from '../oferta-aprobacion/oferta-aprobacion.module';
import { ConfigModule } from '../config/config.module';
import { AprobacionOfertaTipo } from '../oferta-aprobacion/entities/aprobacion-oferta-tipo.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Oferta, OfertaItem, SolcomItem, EstadoCompras, Archivo, AprobacionOfertaTipo]),
        OfertaAprobacionModule,
        ConfigModule,
    ],
    controllers: [OfertaController],
    providers: [OfertaService],
    exports: [OfertaService, TypeOrmModule],
})
export class OfertaModule { }
