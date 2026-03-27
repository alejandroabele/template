import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CashflowSimulacion } from './entities/cashflow-simulacion.entity';
import { CashflowSimulacionTransaccion } from './entities/cashflow-simulacion-transaccion.entity';
import { CashflowSimulacionService } from './cashflow-simulacion.service';
import { CashflowSimulacionTransaccionService } from './cashflow-simulacion-transaccion.service';
import { CashflowSimulacionController } from './cashflow-simulacion.controller';
import { CashflowTransaccion } from '@/modules/cashflow-transaccion/entities/cashflow-transaccion.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            CashflowSimulacion,
            CashflowSimulacionTransaccion,
            CashflowTransaccion,
        ]),
    ],
    controllers: [CashflowSimulacionController],
    providers: [
        CashflowSimulacionService,
        CashflowSimulacionTransaccionService,
    ],
})
export class CashflowSimulacionModule {}
