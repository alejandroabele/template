import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CashflowCategoriaService } from './cashflow-categoria.service';
import { CashflowCategoriaController } from './cashflow-categoria.controller';
import { CashflowCategoria } from './entities/cashflow-categoria.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CashflowCategoria])],
  controllers: [CashflowCategoriaController],
  providers: [CashflowCategoriaService],
  exports: [TypeOrmModule]
})
export class CashflowCategoriaModule { }
