import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { BaseEntity } from '@/common/base.entity';
import { Reserva } from './reserva.entity';
import { Inventario } from '@/modules/inventario/entities/inventario.entity';
import { InventarioReserva } from '@/modules/inventario-reservas/entities/inventario-reserva.entity';

@Entity({ name: 'reserva_item' })
export class ReservaItem extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int', nullable: false, name: 'reserva_id' })
    reservaId: number;

    @ManyToOne(() => Reserva, (reserva) => reserva.items, { nullable: false })
    @JoinColumn({ name: 'reserva_id' })
    reserva: Reserva;

    @Column({ type: 'int', nullable: false, name: 'producto_id' })
    productoId: number;

    @ManyToOne(() => Inventario, { nullable: false })
    @JoinColumn({ name: 'producto_id' })
    producto: Inventario;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
    cantidad: number;

    @Column({ type: 'text', nullable: true })
    observaciones: string;

    @Column({ type: 'int', nullable: true, name: 'inventario_reserva_id' })
    inventarioReservaId: number;

    @ManyToOne(() => InventarioReserva, { nullable: true })
    @JoinColumn({ name: 'inventario_reserva_id' })
    inventarioReserva: InventarioReserva;

    cantidadUsada: number;

}
