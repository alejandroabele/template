import { Module } from '@nestjs/common';
import { PresupuestoMaterialesService } from './presupuesto-materiales.service';
import { PresupuestoMaterialesController } from './presupuesto-materiales.controller';
import { PresupuestoMateriales } from './entities/presupuesto-materiale.entity'
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [PresupuestoMaterialesController],
  providers: [PresupuestoMaterialesService],
  imports: [TypeOrmModule.forFeature([PresupuestoMateriales])],
  exports: [TypeOrmModule],
})
export class PresupuestoMaterialesModule { }
