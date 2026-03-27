import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '@/common/base.entity';
import { JornadaEquipamiento } from './jornada-equipamiento.entity';
import { AlquilerRecurso } from '@/modules/alquiler-recurso/entities/alquiler-recurso.entity';

export enum EquipamientoTipo {
  COMPUTADORAS = 'computadoras',
  HERRAMIENTAS = 'herramientas',
  MAQUINARIAS = 'maquinarias',
  INSTALACIONES = 'instalaciones',
  MOBILIARIOS = 'mobiliarios',
  INSUMOS_INFORMATICOS = 'insumos_informaticos',
}

@Entity({ name: 'equipamiento' })
export class Equipamiento extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'recurso_id', type: 'int', nullable: false })
  recursoId: number;

  @ManyToOne(() => AlquilerRecurso, { nullable: false, eager: false })
  @JoinColumn({ name: 'recurso_id' })
  recurso?: AlquilerRecurso;

  @Column({ type: 'varchar', length: 255, nullable: false })
  nombre: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  modelo: string;

  @Column({ name: 'numero_serie', type: 'varchar', length: 100, nullable: true })
  numeroSerie: string;

  @Column({ type: 'enum', enum: EquipamientoTipo, nullable: false })
  tipo: EquipamientoTipo;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @OneToMany(() => JornadaEquipamiento, (je) => je.equipamiento)
  jornadaEquipamientos?: JornadaEquipamiento[];
}
