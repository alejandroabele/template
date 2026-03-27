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
import { InventarioConversion } from '@/modules/inventario-conversion/entities/inventario-conversion.entity';
import { CentroCosto } from '@/modules/centro-costo/entities/centro-costo.entity';
import { OrdenCompraItem } from '@/modules/orden-compra/entities/orden-compra-item.entity';
import { Persona } from '@/modules/persona/entities/persona.entity';
import { Reserva } from '@/modules/reserva/entities/reserva.entity';


@Entity({ name: 'movimiento_inventario' })
export class MovimientoInventario extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'tipo_movimiento', type: 'varchar', length: 30 })
    tipoMovimiento: string;

    @Column({ type: 'varchar', length: 50 })
    motivo: string;

    @Column({ name: 'cantidad', type: 'decimal', precision: 10, scale: 2 })
    cantidad: number;

    @Column({ name: 'cantidad_antes', type: 'decimal', precision: 10, scale: 2, nullable: true })
    cantidadAntes: number;

    @Column({ name: 'cantidad_despues', type: 'decimal', precision: 10, scale: 2, nullable: true })
    cantidadDespues: number;


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

    @Column({ type: 'text', nullable: true })
    origen: string;

    @ManyToOne(() => InventarioConversion)
    @JoinColumn({ name: 'inventario_conversion_id' })
    inventarioConversion: InventarioConversion;

    @Column({ name: 'inventario_conversion_id', type: 'integer' })
    inventarioConversionId: number;

    @ManyToOne(() => CentroCosto)
    @JoinColumn({ name: 'centro_costo_id' })
    centroCosto: CentroCosto;

    @Column({ name: 'centro_costo_id', type: 'integer', nullable: true })
    centroCostoId: number;

    @ManyToOne(() => OrdenCompraItem)
    @JoinColumn({ name: 'orden_compra_item_id' })
    ordenCompraItem: OrdenCompraItem;

    @Column({ name: 'orden_compra_item_id', type: 'integer', nullable: true })
    ordenCompraItemId: number;

    @Column({ name: 'persona_id', type: 'integer', nullable: true })
    personaId: number;

    @ManyToOne(() => Persona)
    @JoinColumn({ name: 'persona_id' })
    persona: Persona;

    @Column({ name: 'reserva_id', type: 'integer', nullable: true })
    reservaId: number;

    @ManyToOne(() => Reserva)
    @JoinColumn({ name: 'reserva_id' })
    reserva: Reserva;
}
