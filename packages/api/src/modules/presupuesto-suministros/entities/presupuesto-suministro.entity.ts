import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Inventario } from '@/modules/inventario/entities/inventario.entity';
import { Presupuesto } from '@/modules/presupuesto/entities/presupuesto.entity';
import { PresupuestoItem } from '@/modules/presupuesto-item/entities/presupuesto-item.entity';
import { ProduccionTrabajo } from '@/modules/produccion-trabajos/entities/produccion-trabajo.entity';
import { InventarioConversion } from '@/modules/inventario-conversion/entities/inventario-conversion.entity';

@Entity('presupuesto_suministros')
export class PresupuestoSuministro {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Inventario, { nullable: true, onDelete: 'SET NULL' })
    inventario: Inventario;
    @Column({ type: 'int', nullable: true })
    inventarioId: number;

    @ManyToOne(() => Presupuesto, { nullable: true, onDelete: 'SET NULL' })
    presupuesto: Presupuesto;
    @Column({ type: 'int', nullable: true })
    presupuestoId: number;


    @ManyToOne(() => PresupuestoItem, { nullable: true, onDelete: 'SET NULL' })
    presupuestoItem: PresupuestoItem;
    @Column({ type: 'int', nullable: true })
    presupuestoItemId: number;


    @ManyToOne(() => ProduccionTrabajo, { nullable: true, onDelete: 'SET NULL' })
    trabajo: ProduccionTrabajo;
    @Column({ type: 'int', nullable: true })
    trabajoId: number;

    @Column({ type: 'varchar', length: 200, nullable: true, })
    concepto: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.00 })
    punit: number;

    @Column({ type: 'float', nullable: true })
    cantidad: number;

    @Column({ type: 'decimal', precision: 65, scale: 2, default: 0.00 })
    importe: number;

    @Column({ type: 'int', nullable: true, name: 'cantidad_real' })
    cantidadReal: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.00, name: 'costo_prod' })
    costoProduccion: number;

    @ManyToOne(() => InventarioConversion, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'inventario_conversion_id' })
    inventarioConversion: InventarioConversion;

    @Column({ type: 'int', nullable: true, name: 'inventario_conversion_id' })
    inventarioConversionId: number;
}
