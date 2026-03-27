import { Module } from '@nestjs/common';
import { AlquilerRecursoService } from './alquiler-recurso.service';
import { AlquilerRecursoController } from './alquiler-recurso.controller';
import { ExcelExportService } from '@/services/excel-export/excel-export.service'
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlquilerRecurso } from './entities/alquiler-recurso.entity';
@Module({
  imports: [TypeOrmModule.forFeature([AlquilerRecurso])],
  controllers: [AlquilerRecursoController],
  providers: [AlquilerRecursoService, ExcelExportService],
  exports: [TypeOrmModule]

})
export class AlquilerRecursoModule { }
