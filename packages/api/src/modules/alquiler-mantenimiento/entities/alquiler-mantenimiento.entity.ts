import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne } from 'typeorm';
import { AlquilerRecurso } from '@/modules/alquiler-recurso/entities/alquiler-recurso.entity';

@Entity('alquiler_mantenimiento')
export class AlquilerMantenimiento {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        name: 'costo',
        type: 'int',
        nullable: true,
    })
    costo?: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    detalle?: string;

    @Column({ type: 'date', nullable: true, name: 'fecha' })
    fecha: Date;

    @ManyToOne(() => AlquilerRecurso, (alquilerRecurso) => alquilerRecurso.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'alquiler_recurso_id' })
    alquilerRecurso: AlquilerRecurso;

    @Column({ type: 'number', nullable: true, name: 'alquiler_recurso_id' })
    alquilerRecursoId: number;
}
