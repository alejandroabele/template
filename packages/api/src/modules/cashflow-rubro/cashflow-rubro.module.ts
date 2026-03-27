import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CashflowRubroService } from './cashflow-rubro.service';
import { CashflowRubroController } from './cashflow-rubro.controller';
import { CashflowRubro } from './entities/cashflow-rubro.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CashflowRubro])],
  controllers: [CashflowRubroController],
  providers: [CashflowRubroService],
  exports: [CashflowRubroService],
})
export class CashflowRubroModule {}
