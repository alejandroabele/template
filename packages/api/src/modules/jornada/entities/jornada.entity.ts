import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '@/common/base.entity';
import { Presupuesto } from '@/modules/presupuesto/entities/presupuesto.entity';
import { JornadaPersona } from './jornada-persona.entity';
import { JornadaFlota } from '@/modules/flota/entities/jornada-flota.entity';
import { JornadaEquipamiento } from '@/modules/equipamiento/entities/jornada-equipamiento.entity';

@Entity({ name: 'jornada' })
export class Jornada extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'fecha',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  fecha: string;

  @Column({
    name: 'detalle',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  detalle: string;

  @Column({
    name: 'anotaciones',
    type: 'text',
    nullable: true,
  })
  anotaciones: string;

  @Column({
    name: 'cancelado',
    type: 'tinyint',
    default: 0,
  })
  cancelado: number;

  @Column({
    name: 'motivo_cancelacion',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  motivoCancelacion: string;

  @Column({
    name: 'presupuesto_id',
    type: 'int',
    nullable: true,
  })
  presupuestoId: number;

  @ManyToOne(() => Presupuesto, { nullable: true })
  @JoinColumn({ name: 'presupuesto_id' })
  presupuesto?: Presupuesto;

  @Column({
    name: 'tipo',
    type: 'varchar',
    length: 50,
    nullable: true,
    default: 'producto',
  })
  tipo?: string;

  @OneToMany(() => JornadaPersona, jornadaPersona => jornadaPersona.jornada)
  jornadaPersonas?: JornadaPersona[];

  @OneToMany(() => JornadaFlota, je => je.jornada)
  jornadaFlotas?: JornadaFlota[];

  @OneToMany(() => JornadaEquipamiento, je => je.jornada)
  jornadaEquipamientos?: JornadaEquipamiento[];
}
