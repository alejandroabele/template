import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '@/common/base.entity';
import { Jornada } from '@/modules/jornada/entities/jornada.entity';
import { Persona } from '@/modules/persona/entities/persona.entity';
import { Flota } from './flota.entity';

@Entity({ name: 'jornada_flota' })
export class JornadaFlota extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'jornada_id',
    type: 'int',
    nullable: false,
  })
  jornadaId: number;

  @ManyToOne(() => Jornada, (jornada) => jornada.jornadaFlotas, { nullable: false })
  @JoinColumn({ name: 'jornada_id' })
  jornada?: Jornada;

  @Column({
    name: 'flota_id',
    type: 'int',
    nullable: true,
  })
  flotaId?: number;

  @ManyToOne(() => Flota, (flota) => flota.jornadaFlotas, { nullable: true })
  @JoinColumn({ name: 'flota_id' })
  flota?: Flota;

  @Column({
    name: 'persona_responsable_id',
    type: 'int',
    nullable: true,
  })
  personaResponsableId?: number;

  @ManyToOne(() => Persona, { nullable: true })
  @JoinColumn({ name: 'persona_responsable_id' })
  personaResponsable?: Persona;
}
