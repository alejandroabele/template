import { Module } from '@nestjs/common';
import { PresupuestoSuministrosService } from './presupuesto-suministros.service';
import { PresupuestoSuministrosController } from './presupuesto-suministros.controller';
import { PresupuestoSuministro } from './entities/presupuesto-suministro.entity'
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [PresupuestoSuministrosController],
  providers: [PresupuestoSuministrosService],
  imports: [TypeOrmModule.forFeature([PresupuestoSuministro])],
  exports: [TypeOrmModule],
})
export class PresupuestoSuministrosModule { }
