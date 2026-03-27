import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContratoMarcoController } from './contrato-marco.controller';
import { ContratoMarcoService } from './contrato-marco.service';
import { ContratoMarco } from './entities/contrato-marco.entity';
import { ContratoMarcoReportesService } from './contrato-marco-reportes.service'
import { Presupuesto } from '../presupuesto/entities/presupuesto.entity';
import { ContratoMarcoPresupuesto } from '../contrato-marco-presupuesto/entities/contrato-marco-presupuesto.entity';
import { Archivo } from '../archivo/entities/archivo.entity';
@Module({
  imports: [TypeOrmModule.forFeature([ContratoMarco, Presupuesto, ContratoMarcoPresupuesto, Archivo])],
  controllers: [ContratoMarcoController],
  providers: [
    ContratoMarcoService,
    ContratoMarcoReportesService
  ],
  exports: [TypeOrmModule],
})
export class ContratoMarcoModule { }
