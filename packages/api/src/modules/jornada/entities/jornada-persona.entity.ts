import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '@/common/base.entity';
import { Jornada } from './jornada.entity';
import { Persona } from '@/modules/persona/entities/persona.entity';
import { ProduccionTrabajo } from '@/modules/produccion-trabajos/entities/produccion-trabajo.entity';

@Entity({ name: 'jornada_persona' })
export class JornadaPersona extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'jornada_id',
    type: 'int',
    nullable: false,
  })
  jornadaId: number;

  @ManyToOne(() => Jornada, jornada => jornada.jornadaPersonas, { nullable: false })
  @JoinColumn({ name: 'jornada_id' })
  jornada?: Jornada;

  @Column({
    name: 'persona_id',
    type: 'int',
    nullable: false,
  })
  personaId: number;

  @ManyToOne(() => Persona, { nullable: false })
  @JoinColumn({ name: 'persona_id' })
  persona?: Persona;

  @Column({
    name: 'produccion_trabajo_id',
    type: 'int',
    nullable: true,
  })
  produccionTrabajoId?: number;

  @ManyToOne(() => ProduccionTrabajo, { nullable: true })
  @JoinColumn({ name: 'produccion_trabajo_id' })
  produccionTrabajo?: ProduccionTrabajo;

  @Column({
    name: 'inicio',
    type: 'varchar',
    length: 30,
    nullable: true,
  })
  inicio?: string;

  @Column({
    name: 'fin',
    type: 'varchar',
    length: 30,
    nullable: true,
  })
  fin?: string;
}
