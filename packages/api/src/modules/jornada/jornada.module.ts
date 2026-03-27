import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Jornada } from './entities/jornada.entity';
import { JornadaPersona } from './entities/jornada-persona.entity';
import { JornadaFlota } from '@/modules/flota/entities/jornada-flota.entity';
import { JornadaEquipamiento } from '@/modules/equipamiento/entities/jornada-equipamiento.entity';
import { JornadaController } from './jornada.controller';
import { JornadaService } from './jornada.service';
import { Persona } from '@/modules/persona/entities/persona.entity';
import { Presupuesto } from '@/modules/presupuesto/entities/presupuesto.entity';
import { PresupuestoProduccion } from '@/modules/presupuesto-produccion/entities/presupuesto-produccion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Jornada, JornadaPersona, JornadaFlota, JornadaEquipamiento, Persona, Presupuesto, PresupuestoProduccion])],
  exports: [TypeOrmModule],
  controllers: [JornadaController],
  providers: [JornadaService],
})
export class JornadaModule { }
