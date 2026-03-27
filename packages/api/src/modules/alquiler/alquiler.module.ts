import { Module } from '@nestjs/common';
import { AlquilerService } from './alquiler.service';
import { AlquilerReportesService } from './alquiler-reportes.service';
import { AlquilerController } from './alquiler.controller';
import { ExcelExportService } from '@/services/excel-export/excel-export.service'
import { TypeOrmModule } from '@nestjs/typeorm';
import { Alquiler } from './entities/alquiler.entity';
import { AlquilerPrecioModule } from '../alquiler-precio/alquiler-precio.module';
import { ArchivoModule } from '../archivo/archivo.module';
import { AlquilerRecursoModule } from '../alquiler-recurso/alquiler-recurso.module';
import { FacturaModule } from '../factura/factura.module';
import { CobroModule } from '../cobro/cobro.module';
@Module({
  imports: [TypeOrmModule.forFeature([Alquiler]), AlquilerPrecioModule, FacturaModule, CobroModule, ArchivoModule, AlquilerRecursoModule],
  controllers: [AlquilerController],
  providers: [
    AlquilerReportesService,
    AlquilerService, ExcelExportService],


})
export class AlquilerModule { }
