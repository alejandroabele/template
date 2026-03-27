import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn
} from 'typeorm';
import { BaseEntity } from '@/common/base.entity';
import { Categoria } from '@/modules/categoria/entities/categoria.entity';

@Entity({ name: 'inventario_categoria' })
export class InventarioCategoria extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    nombre: string;

    @ManyToOne(() => Categoria)
    @JoinColumn({ name: 'inventario_familia_id' })
    inventarioFamilia: Categoria;

    @Column({ name: 'inventario_familia_id', type: 'int' })
    inventarioFamiliaId: number;
}
