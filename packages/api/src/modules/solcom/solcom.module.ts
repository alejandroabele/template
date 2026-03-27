import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SolcomController } from './solcom.controller';
import { SolcomItemController } from '../solcom-item/solcom-item.controller';
import { SolcomService } from './solcom.service';
import { Solcom } from './entities/solcom.entity';
import { SolcomItem } from './entities/solcom-item.entity';
import { EstadoCompras } from '../estado-compras/entities/estado-compras.entity';
import { RegistroLeidoModule } from '../registro-leido/registro-leido.module';
import { PdfExportService } from '@/services/pdf-export/pdf-export.service';
import { Archivo } from '../archivo/entities/archivo.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Solcom, SolcomItem, EstadoCompras, Archivo]),
    RegistroLeidoModule,
  ],
  controllers: [SolcomController, SolcomItemController],
  providers: [SolcomService, PdfExportService],
  exports: [SolcomService],
})
export class SolcomModule {}
