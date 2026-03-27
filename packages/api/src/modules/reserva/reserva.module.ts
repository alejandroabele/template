import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservaService } from './reserva.service';
import { ReservaController } from './reserva.controller';
import { Reserva } from './entities/reserva.entity';
import { ReservaItem } from './entities/reserva-item.entity';
import { InventarioReserva } from '../inventario-reservas/entities/inventario-reserva.entity';
import { InventarioModule } from '../inventario/inventario.module';
import { PdfExportService } from '@/services/pdf-export/pdf-export.service';
import { ExcelExportService } from '@/services/excel-export/excel-export.service';
import { MovimientoInventarioModule } from '../movimiento-inventario/movimiento-inventario.module';
import { Persona } from '../persona/entities/persona.entity';
import { Presupuesto } from '../presupuesto/entities/presupuesto.entity';
import { Inventario } from '../inventario/entities/inventario.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Reserva, ReservaItem, InventarioReserva, Persona, Presupuesto, Inventario]),
        InventarioModule,
        MovimientoInventarioModule,
    ],
    controllers: [ReservaController],
    providers: [ReservaService, PdfExportService, ExcelExportService],
    exports: [ReservaService],
})
export class ReservaModule { }
