import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CashflowAgrupacion } from './entities/cashflow-agrupacion.entity';
import { CashflowAgrupacionService } from './cashflow-agrupacion.service';
import { CashflowAgrupacionController } from './cashflow-agrupacion.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CashflowAgrupacion])],
  controllers: [CashflowAgrupacionController],
  providers: [CashflowAgrupacionService],
  exports: [CashflowAgrupacionService],
})
export class CashflowAgrupacionModule {}
