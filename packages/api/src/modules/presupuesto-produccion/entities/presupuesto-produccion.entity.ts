import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    OneToMany,
} from 'typeorm';
import { Presupuesto } from '@/modules/presupuesto/entities/presupuesto.entity';
import { ProduccionTrabajo } from '@/modules/produccion-trabajos/entities/produccion-trabajo.entity';

@Entity('presupuesto_produccion')
export class PresupuestoProduccion {


    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    presupuestoId: number;

    @Column({ nullable: true })
    trabajoId: number;

    @Column({ type: 'tinyint', default: 0 })
    iniciado: number;

    @Column({ type: 'tinyint', default: 0 })
    terminado: number;

    @Column({ type: 'date', nullable: true, name: 'fecha_iniciado' })
    fechaIniciado: string;

    @Column({ type: 'date', nullable: true, name: 'fecha_terminado' })
    fechaTerminado: string;

    @ManyToOne(() => Presupuesto, { onDelete: 'NO ACTION' })
    @JoinColumn({ name: 'presupuestoId' })
    presupuesto: Presupuesto;

    @ManyToOne(() => ProduccionTrabajo, { onDelete: 'NO ACTION' })
    @JoinColumn({ name: 'trabajoId' })
    trabajo: ProduccionTrabajo;


}

