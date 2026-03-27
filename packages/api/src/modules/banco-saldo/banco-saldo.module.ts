import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BancoSaldoService } from './banco-saldo.service';
import { BancoSaldoController } from './banco-saldo.controller';
import { BancoSaldo } from './entities/banco-saldo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BancoSaldo])],
  controllers: [BancoSaldoController],
  providers: [BancoSaldoService],
  exports: [TypeOrmModule, BancoSaldoService],
})
export class BancoSaldoModule { }
