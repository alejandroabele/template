import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@/common/base.entity';
import { AlquilerRecurso } from '@/modules/alquiler-recurso/entities/alquiler-recurso.entity';

@Entity('cartel')
export class Cartel extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'recurso_id', type: 'int' })
    recursoId: number;

    @ManyToOne(() => AlquilerRecurso, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'recurso_id' })
    recurso: AlquilerRecurso;

    @Column({ type: 'varchar', length: 255, nullable: true })
    formato?: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    alto?: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    largo?: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    localidad?: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    zona?: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    coordenadas?: string;
}
