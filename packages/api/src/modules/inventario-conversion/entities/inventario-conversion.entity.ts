import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn
} from 'typeorm';
import { BaseEntity } from '@/common/base.entity';
import { Inventario } from '@/modules/inventario/entities/inventario.entity';
@Entity({ name: 'inventario_conversion' })
export class InventarioConversion extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    cantidad: string;

    @Column({ type: 'varchar', length: 255, name: 'unidad_origen' })
    unidadOrigen: string;

    @Column({ type: 'varchar', length: 255, name: 'unidad_destino' })
    unidadDestino: string;

    @Column({ type: 'varchar', length: 200, nullable: true })
    descripcion: string;

    @ManyToOne(() => Inventario)
    @JoinColumn({ name: 'inventario_id' })
    inventario: Inventario;

    @Column({ name: 'inventario_id', type: 'int' })
    inventarioId: number;
}
