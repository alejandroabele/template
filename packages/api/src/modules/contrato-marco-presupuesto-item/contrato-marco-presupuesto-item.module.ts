import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContratoMarcoPresupuestoItem } from './entities/contrato-marco-presupuesto-item.entity';
import { ContratoMarcoPresupuestoItemController } from './contrato-marco-presupuesto-item.controller';
import { ContratoMarcoPresupuestoItemService } from './contrato-marco-presupuesto-item.service';

@Module({
  imports: [TypeOrmModule.forFeature([ContratoMarcoPresupuestoItem])],
  controllers: [ContratoMarcoPresupuestoItemController],
  providers: [ContratoMarcoPresupuestoItemService],
  exports: [TypeOrmModule],
})
export class ContratoMarcoPresupuestoItemModule { }
