import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EquipamientoService } from './equipamiento.service';
import { EquipamientoController } from './equipamiento.controller';
import { Equipamiento } from './entities/equipamiento.entity';
import { JornadaEquipamiento } from './entities/jornada-equipamiento.entity';
import { AlquilerRecurso } from '@/modules/alquiler-recurso/entities/alquiler-recurso.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Equipamiento, JornadaEquipamiento, AlquilerRecurso])],
  controllers: [EquipamientoController],
  providers: [EquipamientoService],
  exports: [TypeOrmModule, EquipamientoService],
})
export class EquipamientoModule {}
