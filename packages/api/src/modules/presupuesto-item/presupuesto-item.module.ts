import { Module } from '@nestjs/common';
import { PresupuestoItemService } from './presupuesto-item.service';
import { PresupuestoItemController } from './presupuesto-item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PresupuestoItem } from './entities/presupuesto-item.entity';
@Module({
  imports: [TypeOrmModule.forFeature([PresupuestoItem])],
  controllers: [PresupuestoItemController],
  providers: [PresupuestoItemService],
  exports: [TypeOrmModule],

})
export class PresupuestoItemModule { }
