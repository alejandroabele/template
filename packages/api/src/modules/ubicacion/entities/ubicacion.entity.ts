import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '@/common/base.entity';
import { AlquilerRecurso } from '@/modules/alquiler-recurso/entities/alquiler-recurso.entity';

@Entity({ name: 'ubicacion' })
export class Ubicacion extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'recurso_id', type: 'int', nullable: false })
  recursoId: number;

  @ManyToOne(() => AlquilerRecurso, { nullable: false, eager: false })
  @JoinColumn({ name: 'recurso_id' })
  recurso?: AlquilerRecurso;

  @Column({ type: 'varchar', length: 255, nullable: false })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;
}
