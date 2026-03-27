import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AlquilerRecurso } from '@/modules/alquiler-recurso/entities/alquiler-recurso.entity';
import { Cliente } from '@/modules/cliente/entities/cliente.entity';

@Entity('alquiler_precio')
export class AlquilerPrecio {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => AlquilerRecurso, (alquilerRecurso) => alquilerRecurso.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'alquiler_recurso_id' })
    alquilerRecurso: AlquilerRecurso;

    @ManyToOne(() => Cliente, (cliente) => cliente, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'cliente_id' })
    cliente: Cliente;

    @Column({
        name: 'precio',
        type: 'int',
        nullable: false,
    })
    precio: number;
    @Column({ type: 'date', name: 'fecha_desde' })
    fechaDesde: Date;
    @Column({ type: 'date', nullable: true, name: 'fecha_fin' })
    fechaFin: Date;
    @Column({ type: 'number', nullable: true, name: 'alquiler_recurso_id' })
    alquilerRecursoId: number;
    @Column({ type: 'int', nullable: true, name: 'cliente_id' })
    clienteId: number;
    @Column({ type: 'varchar', length: 255 })
    localidad: string;
    @Column({ type: 'varchar', length: 255 })
    zona: string;
}
