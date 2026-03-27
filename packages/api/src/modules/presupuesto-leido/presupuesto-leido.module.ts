import { Module } from '@nestjs/common';
import { PresupuestoLeidoService } from './presupuesto-leido.service';
import { PresupuestoLeido } from './entities/presupuesto-leido.entity';
import { PresupuestoLeidoController } from './presupuesto-leido.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PresupuestoLeido])],
  controllers: [PresupuestoLeidoController],
  providers: [PresupuestoLeidoService],
  exports: [PresupuestoLeidoService]
})
export class PresupuestoLeidoModule { }
