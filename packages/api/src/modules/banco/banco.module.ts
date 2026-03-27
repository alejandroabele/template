import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BancoService } from './banco.service';
import { BancoController } from './banco.controller';
import { Banco } from './entities/banco.entity';
import { Archivo } from '@/modules/archivo/entities/archivo.entity';
import { BancoSaldo } from '../banco-saldo/entities/banco-saldo.entity';
import { CashflowTransaccion } from '../cashflow-transaccion/entities/cashflow-transaccion.entity';
import { CashflowCategoria } from '../cashflow-categoria/entities/cashflow-categoria.entity';
import { BancoSaldoModule } from '../banco-saldo/banco-saldo.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Banco, Archivo, BancoSaldo, CashflowTransaccion, CashflowCategoria]),
    forwardRef(() => BancoSaldoModule),
  ],
  controllers: [BancoController],
  providers: [BancoService],
  exports: [TypeOrmModule],
})
export class BancoModule { }
