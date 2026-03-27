import { Module } from '@nestjs/common';
import { ProveedorService } from './proveedor.service';
import { ProveedorController } from './proveedor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Proveedor } from './entities/proveedor.entity';
import { ExcelExportService } from '@/services/excel-export/excel-export.service';
import { Archivo } from '@/modules/archivo/entities/archivo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Proveedor, Archivo])],
  controllers: [ProveedorController],
  providers: [ProveedorService, ExcelExportService],
  exports: [TypeOrmModule]
})
export class ProveedorModule { }
