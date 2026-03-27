import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@/common/base.entity';
import { AlquilerRecurso } from '@/modules/alquiler-recurso/entities/alquiler-recurso.entity';

@Entity('trailer')
export class Trailer extends BaseEntity {
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
}
