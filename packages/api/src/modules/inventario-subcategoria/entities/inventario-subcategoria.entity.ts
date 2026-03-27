import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn
} from 'typeorm';
import { BaseEntity } from '@/common/base.entity';
import { InventarioCategoria } from '@/modules/inventario-categoria/entities/inventario-categoria.entity';

@Entity({ name: 'inventario_subcategoria' })
export class InventarioSubcategoria extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    nombre: string;

    @ManyToOne(() => InventarioCategoria)
    @JoinColumn({ name: 'inventario_categoria_id' })
    inventarioCategoria: InventarioCategoria;

    @Column({ name: 'inventario_categoria_id', type: 'int' })
    inventarioCategoriaId: number;
}
