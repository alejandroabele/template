import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HerramientaService } from './herramienta.service';
import { HerramientaController } from './herramienta.controller';
import { Inventario } from '@/modules/inventario/entities/inventario.entity';
import { MovimientoInventario } from '@/modules/movimiento-inventario/entities/movimiento-inventario.entity';
import { MovimientoInventarioModule } from '@/modules/movimiento-inventario/movimiento-inventario.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Inventario, MovimientoInventario]),
        MovimientoInventarioModule,
    ],
    controllers: [HerramientaController],
    providers: [HerramientaService],
    exports: [HerramientaService],
})
export class HerramientaModule { }
