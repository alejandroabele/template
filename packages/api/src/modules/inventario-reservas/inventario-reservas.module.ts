import { Module, forwardRef } from '@nestjs/common';
import { InventarioReservasService } from './inventario-reservas.service';
import { InventarioReservasController } from './inventario-reservas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventarioReserva } from './entities/inventario-reserva.entity';
import { MovimientoInventarioModule } from '../movimiento-inventario/movimiento-inventario.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([InventarioReserva]),
    forwardRef(() => MovimientoInventarioModule),
  ],
  controllers: [InventarioReservasController],
  providers: [InventarioReservasService],
  exports: [InventarioReservasService],
})
export class InventarioReservasModule { }
