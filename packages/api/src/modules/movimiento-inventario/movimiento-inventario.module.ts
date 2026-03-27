import { Module } from '@nestjs/common';
import { MovimientoInventarioService } from './movimiento-inventario.service';
import { MovimientoInventarioController } from './movimiento-inventario.controller';
import { MovimientoInventario } from './entities/movimiento-inventario.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventarioReserva } from '../inventario-reservas/entities/inventario-reserva.entity';
import { Inventario } from '../inventario/entities/inventario.entity';
import { PrecioHistorial } from '../inventario/entities/precio-historial.entity';
import { InventarioConversion } from '../inventario-conversion/entities/inventario-conversion.entity';
import { OrdenCompraItem } from '../orden-compra/entities/orden-compra-item.entity';
import { Reserva } from '../reserva/entities/reserva.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MovimientoInventario, Inventario, PrecioHistorial, InventarioReserva, InventarioConversion, OrdenCompraItem, Reserva]),],
  controllers: [MovimientoInventarioController],
  providers: [MovimientoInventarioService],
  exports: [TypeOrmModule, MovimientoInventarioService]
})
export class MovimientoInventarioModule { }
