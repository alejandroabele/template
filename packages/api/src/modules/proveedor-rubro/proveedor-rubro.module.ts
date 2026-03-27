import { Module } from '@nestjs/common';
import { ProveedorRubroService } from './proveedor-rubro.service';
import { ProveedorRubroController } from './proveedor-rubro.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProveedorRubro } from './entities/proveedor-rubro.entity';
import { ExcelExportService } from '@/services/excel-export/excel-export.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProveedorRubro])],
  controllers: [ProveedorRubroController],
  providers: [ProveedorRubroService, ExcelExportService],
  exports: [TypeOrmModule]

})
export class ProveedorRubroModule { }
