import { Module } from '@nestjs/common';
import { PresupuestoManoDeObraService } from './presupuesto-mano-de-obra.service';
import { PresupuestoManoDeObraController } from './presupuesto-mano-de-obra.controller';
import { PresupuestoManoDeObra } from './entities/presupuesto-mano-de-obra.entity'
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [PresupuestoManoDeObraController],
  providers: [PresupuestoManoDeObraService],
  imports: [TypeOrmModule.forFeature([PresupuestoManoDeObra])],
  exports: [TypeOrmModule],

})
export class PresupuestoManoDeObraModule { }
