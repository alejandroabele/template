import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '@/common/base.entity';
import { JornadaFlota } from './jornada-flota.entity';
import { AlquilerRecurso } from '@/modules/alquiler-recurso/entities/alquiler-recurso.entity';

export enum FlotaTipo {
  PICKUP = 'pickup',
  CAMION = 'camion',
  AUTO = 'auto',
}

@Entity({ name: 'flota' })
export class Flota extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'recurso_id', type: 'int', nullable: false })
  recursoId: number;

  @ManyToOne(() => AlquilerRecurso, { nullable: false, eager: false })
  @JoinColumn({ name: 'recurso_id' })
  recurso?: AlquilerRecurso;

  @Column({ type: 'enum', enum: FlotaTipo, nullable: false })
  tipo: FlotaTipo;

  @Column({ type: 'varchar', length: 100, nullable: true })
  marca: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  modelo: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  anio: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  patente: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  vin: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  kilometraje: string;

  @Column({ name: 'capacidad_kg', type: 'varchar', length: 100, nullable: true })
  capacidadKg: string;

  @Column({ name: 'cantidad_ejes', type: 'varchar', length: 100, nullable: true })
  cantidadEjes: string;

  @Column({ name: 'cantidad_auxilio', type: 'varchar', length: 100, nullable: true })
  cantidadAuxilio: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @OneToMany(() => JornadaFlota, (je) => je.flota)
  jornadaFlotas?: JornadaFlota[];
}
