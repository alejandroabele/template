import { Module } from '@nestjs/common';
import { InventarioCategoriaService } from './inventario-categoria.service';
import { InventarioCategoriaController } from './inventario-categoria.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventarioCategoria } from './entities/inventario-categoria.entity';
@Module({
  imports: [TypeOrmModule.forFeature([InventarioCategoria])],
  controllers: [InventarioCategoriaController],
  providers: [InventarioCategoriaService],
})
export class InventarioCategoriaModule { }
