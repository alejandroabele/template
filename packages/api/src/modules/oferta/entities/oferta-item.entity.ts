import { BaseEntity } from '@/common/base.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Oferta } from './oferta.entity';
import { Inventario } from '@/modules/inventario/entities/inventario.entity';
import { InventarioConversion } from '@/modules/inventario-conversion/entities/inventario-conversion.entity';
import { SolcomItem } from '@/modules/solcom/entities/solcom-item.entity';

@Entity({ name: 'oferta_item' })
export class OfertaItem extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Oferta, (oferta) => oferta.items, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'oferta_id' })
    oferta: Oferta;

    @Column({
        name: 'oferta_id',
        type: 'int',
        nullable: false,
    })
    ofertaId: number;

    @ManyToOne(() => SolcomItem, { nullable: true, eager: true })
    @JoinColumn({ name: 'solcom_item_id' })
    solcomItem: SolcomItem;

    @Column({
        name: 'solcom_item_id',
        type: 'int',
        nullable: true,
    })
    solcomItemId: number;

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
        name: 'descripcion',
        type: 'text',
        nullable: true,
    })
    descripcion: string;
}
