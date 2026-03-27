import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Inventario } from './inventario.entity';
import { OrdenCompra } from '@/modules/orden-compra/entities/orden-compra.entity';
import { Usuario } from '@/modules/auth/usuario/entities/usuario.entity';

@Entity({ name: 'precio_historial' })
export class PrecioHistorial {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'inventario_id', type: 'int', nullable: false })
    inventarioId: number;

    @ManyToOne(() => Inventario, { nullable: false })
    @JoinColumn({ name: 'inventario_id' })
    inventario: Inventario;

    @Column({ name: 'orden_compra_id', type: 'int', nullable: true })
    ordenCompraId: number | null;

    @ManyToOne(() => OrdenCompra, { nullable: true, eager: true })
    @JoinColumn({ name: 'orden_compra_id' })
    ordenCompra: OrdenCompra | null;

    @Column({ name: 'precio_unitario', type: 'varchar', length: 50, nullable: false })
    precioUnitario: string;

    @Column({ name: 'motivo', type: 'text', nullable: true })
    motivo: string | null;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @Column({ name: 'created_by', type: 'int', nullable: true })
    createdBy: number | null;

    @ManyToOne(() => Usuario, { nullable: true, eager: true })
    @JoinColumn({ name: 'created_by' })
    createdByUser: Usuario | null;
}
