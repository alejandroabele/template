import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdenCompraController } from './orden-compra.controller';
import { OrdenCompraService } from './orden-compra.service';
import { OrdenCompra } from './entities/orden-compra.entity';
import { OrdenCompraItem } from './entities/orden-compra-item.entity';
import { Oferta } from '../oferta/entities/oferta.entity';
import { EstadoCompras } from '../estado-compras/entities/estado-compras.entity';
import { PdfExportService } from '@/services/pdf-export/pdf-export.service';
import { AfipModule } from '../afip/afip.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrdenCompra, OrdenCompraItem, Oferta, EstadoCompras]),
    AfipModule,
  ],
  controllers: [OrdenCompraController],
  providers: [OrdenCompraService, PdfExportService],
  exports: [OrdenCompraService],
})
export class OrdenCompraModule {}
