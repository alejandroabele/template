import { BaseEntity } from '@/common/base.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany, OneToOne, AfterLoad } from 'typeorm';
import { Proveedor } from '@/modules/proveedor/entities/proveedor.entity';
import { MetodoPago } from '@/modules/metodo-pago/entities/metodo-pago.entity';
import { PlazoPago } from '@/modules/plazo-pago/entities/plazo-pago.entity';
import { EstadoCompras } from '@/modules/estado-compras/entities/estado-compras.entity';
import { OfertaItem } from './oferta-item.entity';
import { OrdenCompra } from '@/modules/orden-compra/entities/orden-compra.entity';
import { OfertaAprobacion } from '@/modules/oferta-aprobacion/entities/oferta-aprobacion.entity';

@Entity({ name: 'oferta' })
export class Oferta extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Proveedor, { nullable: true, eager: true })
    @JoinColumn({ name: 'proveedor_id' })
    proveedor: Proveedor;

    @Column({
        name: 'proveedor_id',
        type: 'int',
        nullable: true,
    })
    proveedorId: number;

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

    @Column({
        name: 'fecha_disponibilidad',
        type: 'varchar',
        length: 20,
        nullable: true,
    })
    fechaDisponibilidad: string;

    @Column({
        name: 'observaciones',
        type: 'text',
        nullable: true,
    })
    observaciones: string;

    @Column({
        name: 'anotaciones_internas',
        type: 'text',
        nullable: true,
    })
    anotacionesInternas: string;

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
        name: 'validez',
        type: 'varchar',
        length: 50,
        nullable: true,
    })
    validez: string;

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

    @Column({
        name: 'color',
        type: 'varchar',
        length: 20,
        nullable: true,
    })
    color: string;

    @Column({
        name: 'favorito',
        type: 'boolean',
        default: false,
    })
    favorito: boolean;

    // Checks de control para orden de compra
    @Column({
        name: 'control_articulos_extra',
        type: 'boolean',
        default: false,
    })
    controlArticulosExtra: boolean;

    @Column({
        name: 'control_cantidades',
        type: 'boolean',
        default: false,
    })
    controlCantidades: boolean;

    @Column({
        name: 'control_metodo_plazo_pago',
        type: 'boolean',
        default: false,
    })
    controlMetodoPLazoPago: boolean;

    @Column({
        name: 'control_monto',
        type: 'boolean',
        default: false,
    })
    controlMonto: boolean;

    @OneToMany(() => OfertaItem, (item) => item.oferta, { eager: true, cascade: true })
    items: OfertaItem[];

    @OneToOne(() => OrdenCompra, (ordenCompra) => ordenCompra.oferta, { eager: false })
    ordenCompra: OrdenCompra;

    @OneToMany(() => OfertaAprobacion, (aprobacion) => aprobacion.oferta, { eager: false })
    aprobaciones: OfertaAprobacion[];

    // Se calcula automáticamente después de cargar la entidad si los items están presentes
    montoTotal?: number;
    @AfterLoad()
    calcularMontoTotal() {
        if (Array.isArray(this.items) && this.items.length) {
            this.montoTotal = this.items
                .reduce((total, item) => {
                    const cantidad = Number(item.cantidad) || 0;
                    const precio = Number(item.precio) || 0;
                    return Number(total) + (cantidad * precio);
                }, 0);
        } else {
            this.montoTotal = 0;
        }
    }
}
