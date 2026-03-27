import { BaseEntity } from '@/common/base.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Oferta } from '@/modules/oferta/entities/oferta.entity';
import { MetodoPago } from '@/modules/metodo-pago/entities/metodo-pago.entity';
import { PlazoPago } from '@/modules/plazo-pago/entities/plazo-pago.entity';
import { EstadoCompras } from '@/modules/estado-compras/entities/estado-compras.entity';
import { OrdenCompraItem } from './orden-compra-item.entity';

@Entity({ name: 'orden_compra' })
export class OrdenCompra extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Oferta, { nullable: false, eager: true })
    @JoinColumn({ name: 'oferta_id' })
    oferta: Oferta;

    @Column({
        name: 'oferta_id',
        type: 'int',
        nullable: false,
    })
    ofertaId: number;

    @ManyToOne(() => MetodoPago, { nullable: true, eager: true })
    @JoinColumn({ name: 'metodo_id' })
    metodoPago: MetodoPago;

    @Column({
        name: 'metodo_id',
        type: 'int',
        nullable: true,
    })
    metodoPagoId: number;

    @ManyToOne(() => PlazoPago, { nullable: true, eager: true })
    @JoinColumn({ name: 'plazo_id' })
    plazoPago: PlazoPago;

    @Column({
        name: 'plazo_id',
        type: 'int',
        nullable: true,
    })
    plazoPagoId: number;

    @ManyToOne(() => EstadoCompras, { nullable: true, eager: true })
    @JoinColumn({ name: 'estado_id' })
    estado: EstadoCompras;

    @Column({
        name: 'estado_id',
        type: 'int',
        nullable: true,
    })
    estadoId: number;

    @Column({
        name: 'fecha_emision',
        type: 'varchar',
        length: 20,
        nullable: true,
    })
    fechaEmision: string;

    @Column({
        name: 'obs',
        type: 'text',
        nullable: true,
    })
    obs: string;

    @Column({
        name: 'bonificacion',
        type: 'varchar',
        length: 50,
        nullable: true,
    })
    bonificacion: string;

    @Column({
        name: 'moneda',
        type: 'varchar',
        length: 10,
        nullable: true,
    })
    moneda: string;

    @OneToMany(() => OrdenCompraItem, (item) => item.ordenCompra, { eager: true, cascade: true })
    items: OrdenCompraItem[];
}
