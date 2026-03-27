import { BaseEntity } from '@/common/base.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Solcom } from './solcom.entity';
import { Inventario } from '@/modules/inventario/entities/inventario.entity';
import { InventarioConversion } from '@/modules/inventario-conversion/entities/inventario-conversion.entity';
import { Usuario } from '@/modules/auth/usuario/entities/usuario.entity';
import { OfertaItem } from '@/modules/oferta/entities/oferta-item.entity';

@Entity({ name: 'solcom_item' })
export class SolcomItem extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Solcom, (solcom) => solcom.items, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'solcom_id' })
    solcom: Solcom;

    @Column({
        name: 'solcom_id',
        type: 'int',
        nullable: false,
    })
    solcomId: number;

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
        name: 'descripcion',
        type: 'varchar',
        length: 150,
        nullable: true,
    })
    descripcion: string;

    @Column({
        name: 'cantidad',
        type: 'varchar',
        length: 50,
        nullable: true,
    })
    cantidad: string;

    @Column({
        name: 'minimo',
        type: 'varchar',
        length: 50,
        nullable: true,
    })
    minimo: string;

    @Column({
        name: 'maximo',
        type: 'varchar',
        length: 50,
        nullable: true,
    })
    maximo: string;

    @ManyToOne(() => Usuario, { nullable: true, eager: true })
    @JoinColumn({ name: 'comprador_id' })
    comprador: Usuario;

    @Column({
        name: 'comprador_id',
        type: 'int',
        nullable: true,
    })
    compradorId: number;

    @OneToMany(() => OfertaItem, (ofertaItem) => ofertaItem.solcomItem)
    ofertaItems: OfertaItem[];
}
