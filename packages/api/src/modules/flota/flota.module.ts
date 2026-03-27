import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlotaService } from './flota.service';
import { FlotaController } from './flota.controller';
import { Flota } from './entities/flota.entity';
import { JornadaFlota } from './entities/jornada-flota.entity';
import { AlquilerRecurso } from '@/modules/alquiler-recurso/entities/alquiler-recurso.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Flota, JornadaFlota, AlquilerRecurso])],
  controllers: [FlotaController],
  providers: [FlotaService],
  exports: [FlotaService],
})
export class FlotaModule {}
