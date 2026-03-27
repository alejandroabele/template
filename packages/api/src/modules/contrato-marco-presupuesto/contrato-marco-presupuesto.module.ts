import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContratoMarcoPresupuesto } from './entities/contrato-marco-presupuesto.entity';
import { ContratoMarcoPresupuestoItem } from '@/modules/contrato-marco-presupuesto-item/entities/contrato-marco-presupuesto-item.entity';
import { ContratoMarcoPresupuestoController } from './contrato-marco-presupuesto.controller';
import { ContratoMarcoPresupuestoService } from './contrato-marco-presupuesto.service';
import { Presupuesto } from '../presupuesto/entities/presupuesto.entity';
import { PresupuestoProduccion } from '../presupuesto-produccion/entities/presupuesto-produccion.entity';
import { PresupuestoItem } from '../presupuesto-item/entities/presupuesto-item.entity';
import { RecetaModule } from '../receta/receta.module';
import { PresupuestoModule } from '../presupuesto/presupuesto.module';

@Module({
  imports: [TypeOrmModule.forFeature([ContratoMarcoPresupuesto, ContratoMarcoPresupuestoItem, Presupuesto, PresupuestoItem, PresupuestoProduccion]), RecetaModule,
  forwardRef(() => PresupuestoModule),
  ],
  controllers: [ContratoMarcoPresupuestoController],
  providers: [ContratoMarcoPresupuestoService],
  exports: [TypeOrmModule, ContratoMarcoPresupuestoService],
})
export class ContratoMarcoPresupuestoModule { }
