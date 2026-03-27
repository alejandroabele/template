import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '@/common/base.entity';
import { Jornada } from '@/modules/jornada/entities/jornada.entity';
import { Persona } from '@/modules/persona/entities/persona.entity';
import { Equipamiento } from './equipamiento.entity';

@Entity({ name: 'jornada_equipamiento' })
export class JornadaEquipamiento extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'jornada_id', type: 'int', nullable: false })
  jornadaId: number;

  @ManyToOne(() => Jornada, (jornada) => jornada.jornadaEquipamientos, { nullable: false })
  @JoinColumn({ name: 'jornada_id' })
  jornada?: Jornada;

  @Column({ name: 'equipamiento_id', type: 'int', nullable: false })
  equipamientoId: number;

  @ManyToOne(() => Equipamiento, (equipamiento) => equipamiento.jornadaEquipamientos, { nullable: false })
  @JoinColumn({ name: 'equipamiento_id' })
  equipamiento?: Equipamiento;

  @Column({ name: 'persona_responsable_id', type: 'int', nullable: true })
  personaResponsableId?: number;

  @ManyToOne(() => Persona, { nullable: true })
  @JoinColumn({ name: 'persona_responsable_id' })
  personaResponsable?: Persona;
}
