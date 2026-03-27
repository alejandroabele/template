import { Module } from '@nestjs/common';
import { PresupuestoProduccionService } from './presupuesto-produccion.service';
import { PresupuestoProduccionController } from './presupuesto-produccion.controller';
import { PresupuestoProduccion } from './entities/presupuesto-produccion.entity';
import { PresupuestoModule } from '@/modules/presupuesto/presupuesto.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Presupuesto } from '../presupuesto/entities/presupuesto.entity';
import { PresupuestoItem } from '../presupuesto-item/entities/presupuesto-item.entity';
import { PresupuestoMateriales } from '../presupuesto-materiales/entities/presupuesto-materiale.entity';
import { PresupuestoSuministro } from '../presupuesto-suministros/entities/presupuesto-suministro.entity';
import { MovimientoInventarioModule } from '../movimiento-inventario/movimiento-inventario.module';
import { InventarioReservasModule } from '../inventario-reservas/inventario-reservas.module';
@Module({
  imports: [TypeOrmModule.forFeature([PresupuestoProduccion, Presupuesto, PresupuestoMateriales, PresupuestoSuministro]), MovimientoInventarioModule, InventarioReservasModule],
  controllers: [PresupuestoProduccionController],
  providers: [PresupuestoProduccionService],
  exports: [TypeOrmModule],
})
export class PresupuestoProduccionModule { }
