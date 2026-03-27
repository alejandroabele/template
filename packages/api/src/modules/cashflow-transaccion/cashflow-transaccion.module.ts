import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CashflowTransaccionService } from './cashflow-transaccion.service';
import { CashflowReportesService } from './cashflow-reportes.service';
import { CashflowHelperService } from './cashflow-helper.service';
import { CashflowTransaccionController } from './cashflow-transaccion.controller';
import { CashflowTransaccion } from './entities/cashflow-transaccion.entity';
import { CashflowCategoria } from '@/modules/cashflow-categoria/entities/cashflow-categoria.entity';
import { BancoSaldo } from '@/modules/banco-saldo/entities/banco-saldo.entity';
import { Banco } from '@/modules/banco/entities/banco.entity';
import { ExcelReaderService } from '@/services/excel-reader/excel-reader.service';
import { ExcelExportService } from '@/services/excel-export/excel-export.service';
import { CashflowSimulacionTransaccion } from '@/modules/cashflow-simulacion/entities/cashflow-simulacion-transaccion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CashflowTransaccion, CashflowSimulacionTransaccion, CashflowCategoria, BancoSaldo, Banco])],
  controllers: [CashflowTransaccionController],
  providers: [CashflowTransaccionService, CashflowReportesService, CashflowHelperService, ExcelReaderService, ExcelExportService],
  exports: [TypeOrmModule],
})
export class CashflowTransaccionModule { }
