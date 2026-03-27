import { Module } from '@nestjs/common';
import { RecetaService } from './receta.service';
import { RecetaController } from './receta.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Receta } from './entities/receta.entity';
import { RecetaInventario } from './entities/receta-inventario.entity';
import { InventarioModule } from '../inventario/inventario.module';
import { ProduccionTrabajosModule } from '../produccion-trabajos/produccion-trabajos.module';
@Module({
  imports: [TypeOrmModule.forFeature([Receta, RecetaInventario]), InventarioModule, ProduccionTrabajosModule],
  controllers: [RecetaController],
  providers: [RecetaService], // Proveedor del servicio
  exports: [RecetaService]
})
export class RecetaModule { }
