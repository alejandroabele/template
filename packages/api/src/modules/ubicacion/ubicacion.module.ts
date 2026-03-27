import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UbicacionService } from './ubicacion.service';
import { UbicacionController } from './ubicacion.controller';
import { Ubicacion } from './entities/ubicacion.entity';
import { AlquilerRecurso } from '@/modules/alquiler-recurso/entities/alquiler-recurso.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ubicacion, AlquilerRecurso])],
  controllers: [UbicacionController],
  providers: [UbicacionService],
  exports: [UbicacionService],
})
export class UbicacionModule {}
