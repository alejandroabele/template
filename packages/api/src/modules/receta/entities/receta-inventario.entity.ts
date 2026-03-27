import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Receta } from './receta.entity';
import { Inventario } from '@/modules/inventario/entities/inventario.entity';
import { ProduccionTrabajo } from '@/modules/produccion-trabajos/entities/produccion-trabajo.entity';

@Entity('receta_inventario')
export class RecetaInventario {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'receta_id', type: 'int' })
    recetaId: number;

    @Column({ name: 'producto_id', type: 'int' })
    inventarioId: number;

    @Column({ name: 'tipo', type: 'enum', enum: ['SUMINISTROS', 'MATERIALES', 'MANO_DE_OBRA'] })
    tipo: string;

    @Column({ type: 'float', nullable: true })
    cantidad: number;

    @Column({
        type: 'enum',
        enum: ['METALURGICA', 'PINTURA', 'GRAFICA', 'PLOTEO', 'TERMINACIONES', 'OBRA', 'MONTAJE', 'SERVICIO_PETROLERO'],
        nullable: false,
    })
    etapa: string;

    @ManyToOne(() => ProduccionTrabajo, { nullable: true })
    @JoinColumn({ name: 'produccion_trabajo_id' })
    produccionTrabajo: ProduccionTrabajo;

    @Column({ type: 'int', nullable: true, name: 'produccion_trabajo_id' })
    produccionTrabajoId: number;

    @ManyToOne(() => Receta, (receta) => receta.productos, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'receta_id' })
    receta: Receta;

    @ManyToOne(() => Inventario, (inventario) => inventario, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'producto_id' })
    inventario: Inventario;
}
