import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Inventario } from '@/modules/inventario/entities/inventario.entity';
import { Presupuesto } from '@/modules/presupuesto/entities/presupuesto.entity';
import { ProduccionTrabajo } from '@/modules/produccion-trabajos/entities/produccion-trabajo.entity';
import { BaseEntity } from '@/common/base.entity';
import { CentroCosto } from '@/modules/centro-costo/entities/centro-costo.entity';
import { Reserva } from '@/modules/reserva/entities/reserva.entity';

@Entity({ name: 'inventario_reservas' })
export class InventarioReserva extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'cantidad', type: 'decimal', precision: 10, scale: 2 })
    cantidad: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    fecha: Date;

    @Column({ type: 'text', nullable: true })
    observaciones: string;

    @ManyToOne(() => Inventario)
    @JoinColumn({ name: 'producto_id' })
    producto: Inventario;

    @Column({ name: 'producto_id', type: 'integer' })
    productoId: number;

    @ManyToOne(() => Presupuesto)
    @JoinColumn({ name: 'presupuesto_id' })
    presupuesto: Presupuesto;

    @Column({ name: 'presupuesto_id', type: 'integer', nullable: true })
    presupuestoId: number;

    @ManyToOne(() => ProduccionTrabajo)
    @JoinColumn({ name: 'trabajo_id' })
    trabajo: ProduccionTrabajo;

    @Column({ name: 'trabajo_id', type: 'integer' })
    trabajoId: number;

    @ManyToOne(() => CentroCosto)
    @JoinColumn({ name: 'centro_costo_id' })
    centroCosto: CentroCosto;

    @Column({ name: 'centro_costo_id', type: 'integer', nullable: true })
    centroCostoId: number;

    @ManyToOne(() => Reserva)
    @JoinColumn({ name: 'reserva_id' })
    reserva: Reserva;

    @Column({ name: 'reserva_id', type: 'integer', nullable: true })
    reservaId: number;
}
