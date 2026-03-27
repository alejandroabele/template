import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventarioSubcategoriaService } from './inventario-subcategoria.service';
import { InventarioSubcategoriaController } from './inventario-subcategoria.controller';
import { InventarioSubcategoria } from './entities/inventario-subcategoria.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InventarioSubcategoria])],
  controllers: [InventarioSubcategoriaController],
  providers: [InventarioSubcategoriaService],
})
export class InventarioSubcategoriaModule { }
