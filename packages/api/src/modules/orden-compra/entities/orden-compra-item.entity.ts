import { BaseEntity } from '@/common/base.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { OrdenCompra } from './orden-compra.entity';
import { Inventario } from '@/modules/inventario/entities/inventario.entity';
import { InventarioConversion } from '@/modules/inventario-conversion/entities/inventario-conversion.entity';

@Entity({ name: 'orden_compra_item' })
export class OrdenCompraItem extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => OrdenCompra, (ordenCompra) => ordenCompra.items, { nullable: false })
    @JoinColumn({ name: 'orden_compra_id' })
    ordenCompra: OrdenCompra;

    @Column({
        name: 'orden_compra_id',
        type: 'int',
        nullable: false,
    })
    ordenCompraId: number;

    @ManyToOne(() => Inventario, { nullable: false, eager: true })
    @JoinColumn({ name: 'inventario_id' })
    inventario: Inventario;

    @Column({
        name: 'inventario_id',
        type: 'int',
        nullable: false,
    })
    inventarioId: number;

    @ManyToOne(() => InventarioConversion, { nullable: true, eager: true })
    @JoinColumn({ name: 'inventario_conversion_id' })
    inventarioConversion: InventarioConversion;

    @Column({
        name: 'inventario_conversion_id',
        type: 'int',
        nullable: true,
    })
    inventarioConversionId: number;

    @Column({
        name: 'cantidad',
        type: 'varchar',
        length: 50,
        nullable: true,
    })
    cantidad: string;

    @Column({
        name: 'precio',
        type: 'varchar',
        length: 50,
        nullable: true,
    })
    precio: string;

    @Column({
        name: 'alicuota',
        type: 'varchar',
        length: 10,
        nullable: true,
    })
    alicuota: string;

    @Column({
        name: 'recepcionado',
        type: 'tinyint',
        default: 0,
    })
    recepcionado: boolean;

    @Column({
        name: 'cantidad_recepcionada',
        type: 'varchar',
        length: 255,
        nullable: true,
    })
    cantidadRecepcionada: string;

    @Column({
        name: 'descripcion',
        type: 'text',
        nullable: true,
    })
    descripcion: string;
}
