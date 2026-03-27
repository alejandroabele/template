import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany, AfterLoad } from 'typeorm';
import { Categoria } from '@/modules/categoria/entities/categoria.entity';
import { BaseEntity } from '@/common/base.entity';
import { InventarioCategoria } from '@/modules/inventario-categoria/entities/inventario-categoria.entity';
import { InventarioSubcategoria } from '@/modules/inventario-subcategoria/entities/inventario-subcategoria.entity';
import { InventarioReserva } from '@/modules/inventario-reservas/entities/inventario-reserva.entity';
import { CuentaContable } from '@/modules/cuenta-contable/entities/cuenta-contable.entity';
@Entity({ name: 'inventario' })
export class Inventario extends BaseEntity {
    @PrimaryGeneratedColumn({ name: 'inventarioId' })
    id: number;

    @Column({
        name: 'nombre',
        type: 'varchar',
        length: 100,
        nullable: false,
    })
    nombre: string;

    @Column({
        name: 'punit',
        type: 'float',
        nullable: false,

    })
    punit: number;

    @Column({
        name: 'alicuota',
        type: 'varchar',
        length: 10,
        nullable: true,
    })
    alicuota: string;



    @Column({
        name: 'manejaStock',
        type: 'boolean',
        nullable: false,
    })
    manejaStock: boolean;

    @Column({
        name: 'es_herramienta',
        type: 'boolean',
        nullable: false,
        default: false,
    })
    esHerramienta: boolean;


    @Column({
        name: 'stock',
        type: 'decimal',
        nullable: false,
    })
    stock: number;

    @Column({
        name: 'alerta',
        type: 'decimal',
        nullable: false,
    })
    alerta: number;

    @ManyToOne(() => Categoria, (categoria) => categoria)
    @JoinColumn({
        name: 'categoriaId',
        referencedColumnName: 'id',
    })
    categoria: Categoria;

    @Column({
        name: 'categoriaId',
        nullable: true,
    })
    categoriaId: number;

    @Column({
        name: 'unidad_medida',
        type: 'varchar',
        length: 100,
        nullable: true,
    })
    unidadMedida: string

    @Column({
        name: 'sku',
        type: 'varchar',
        length: 50,
        nullable: false,
    })
    sku: string;

    @Column({
        name: 'descripcion',
        type: 'varchar',
        length: 50,
        nullable: true,
    })
    descripcion: string;

    @Column({
        name: 'stock_minimo',
        type: 'float',
        nullable: false,
    })
    stockMinimo: number;

    @Column({
        name: 'stock_maximo',
        type: 'float',
        nullable: false,
    })
    stockMaximo: number;

    // Relación con reservas activas para calcular stockReservado dinámicamente
    @OneToMany(() => InventarioReserva, (reserva) => reserva.producto)
    reservas: InventarioReserva[];

    // Se calcula automáticamente después de cargar la entidad si las reservas están presentes
    stockReservado?: number;
    @AfterLoad()
    calcularStockReservado() {
        if (Array.isArray(this.reservas) && this.reservas.length) {
            this.stockReservado = this.reservas
                .filter(r => !r.deletedAt)
                .reduce((sum, r) => Number(sum) + Number(r.cantidad ?? 0), 0);
        } else {
            this.stockReservado = 0;
        }
    }

    @ManyToOne(() => InventarioCategoria, (inventarioCategoria) => inventarioCategoria)
    @JoinColumn({
        name: 'inventario_categoria_id',
        referencedColumnName: 'id',
    })
    inventarioCategoria: InventarioCategoria;

    @Column({
        name: 'inventario_categoria_id',
        nullable: true,
    })
    inventarioCategoriaId: number;

    @ManyToOne(() => InventarioSubcategoria, (inventarioSubcategoria) => inventarioSubcategoria)
    @JoinColumn({
        name: 'inventario_subcategoria_id',
        referencedColumnName: 'id',
    })
    inventarioSubcategoria: InventarioSubcategoria;

    @Column({
        name: 'inventario_subcategoria_id',
        nullable: true,
    })
    inventarioSubcategoriaId: number;

    @ManyToOne(() => CuentaContable, (cuentaContable) => cuentaContable)
    @JoinColumn({
        name: 'cuenta_contable_id',
        referencedColumnName: 'id',
    })
    cuentaContable: CuentaContable;

    @Column({
        name: 'cuenta_contable_id',
        nullable: true,
    })
    cuentaContableId: number;
}
