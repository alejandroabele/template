import { Module } from '@nestjs/common';
import { InventarioService } from './inventario.service';
import { InventarioController } from './inventario.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventario } from './entities/inventario.entity';
import { PrecioHistorial } from './entities/precio-historial.entity';
import { MovimientoInventarioService } from '../movimiento-inventario/movimiento-inventario.service';
import { MovimientoInventarioModule } from '../movimiento-inventario/movimiento-inventario.module';
import { MovimientoInventario } from '../movimiento-inventario/entities/movimiento-inventario.entity';
import { ArchivoModule } from '../archivo/archivo.module';
import { ExcelExportService } from '@/services/excel-export/excel-export.service';
import { ExcelReaderService } from '@/services/excel-reader/excel-reader.service';
import { Categoria } from '../categoria/entities/categoria.entity';
import { InventarioCategoria } from '../inventario-categoria/entities/inventario-categoria.entity';
import { InventarioSubcategoria } from '../inventario-subcategoria/entities/inventario-subcategoria.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      Inventario,
      PrecioHistorial,
      MovimientoInventario,
      Categoria,
      InventarioCategoria,
      InventarioSubcategoria
    ]),
    MovimientoInventarioModule,
    ArchivoModule
  ],
  controllers: [InventarioController],
  providers: [
    InventarioService,
    MovimientoInventarioService,
    ExcelExportService,
    ExcelReaderService
  ],
  exports: [TypeOrmModule, InventarioService]
})
export class InventarioModule { }
