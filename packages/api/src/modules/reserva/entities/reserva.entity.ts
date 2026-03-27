import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { BaseEntity } from '@/common/base.entity';
import { Presupuesto } from '@/modules/presupuesto/entities/presupuesto.entity';
import { ProduccionTrabajo } from '@/modules/produccion-trabajos/entities/produccion-trabajo.entity';
import { CentroCosto } from '@/modules/centro-costo/entities/centro-costo.entity';
import { Persona } from '@/modules/persona/entities/persona.entity';
import { ReservaItem } from './reserva-item.entity';
import { MovimientoInventario } from '@/modules/movimiento-inventario/entities/movimiento-inventario.entity';

@Entity({ name: 'reserva' })
export class Reserva extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    fecha: Date;

    @Column({ type: 'text', nullable: true })
    observaciones: string;

    @Column({ type: 'int', nullable: true, name: 'presupuesto_id' })
    presupuestoId: number;

    @ManyToOne(() => Presupuesto, { nullable: true })
    @JoinColumn({ name: 'presupuesto_id' })
    presupuesto: Presupuesto;

    @Column({ type: 'int', nullable: true, name: 'trabajo_id' })
    trabajoId: number;

    @ManyToOne(() => ProduccionTrabajo, { nullable: true })
    @JoinColumn({ name: 'trabajo_id' })
    trabajo: ProduccionTrabajo;

    @Column({ type: 'int', nullable: true, name: 'centro_costo_id' })
    centroCostoId: number;

    @ManyToOne(() => CentroCosto, { nullable: true })
    @JoinColumn({ name: 'centro_costo_id' })
    centroCosto: CentroCosto;

    @Column({ type: 'int', nullable: true, name: 'persona_id' })
    personaId: number;

    @ManyToOne(() => Persona, { nullable: true })
    @JoinColumn({ name: 'persona_id' })
    persona: Persona;

    @OneToMany(() => ReservaItem, (item) => item.reserva)
    items: ReservaItem[];

    @OneToMany(() => MovimientoInventario, (movimiento) => movimiento.reserva)
    movimientos: MovimientoInventario[];
}
