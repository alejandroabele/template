import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('presupuesto_leido')
export class PresupuestoLeido {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'usuario_id' })
    usuarioId: number;

    @Column({ name: 'presupuesto_id' })
    presupuestoId: number;

    @Column({ type: 'timestamp', name: 'fecha' })
    fecha: Date;
}
