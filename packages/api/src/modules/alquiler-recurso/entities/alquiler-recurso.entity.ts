import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Alquiler } from '@/modules/alquiler/entities/alquiler.entity'
import { AlquilerMantenimiento } from '@/modules/alquiler-mantenimiento/entities/alquiler-mantenimiento.entity'
import { Presupuesto } from '@/modules/presupuesto/entities/presupuesto.entity';
import { AlquilerPrecio } from '@/modules/alquiler-precio/entities/alquiler-precio.entity';

@Entity('alquiler_recurso')
export class AlquilerRecurso {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    codigo: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    proveedor?: string;

    @Column({ type: 'varchar', length: 255 })
    tipo?: 'FLOTA' | 'TRAILERS' | 'CARTELES' | 'EQUIPAMIENTO' | 'UBICACION';

    @Column({
        name: 'precio',
        type: 'int',
        nullable: true,
    })
    precio?: number;

    @Column({ type: 'date', name: "inicio_contrato_sub_alquiler", nullable: true })
    inicioContratoSubAlquiler: Date;

    @Column({ type: 'date', name: 'vencimiento_contrato_sub_alquiler', nullable: true })
    vencimientoContratoSubAlquiler: Date;

    @OneToMany(() => Alquiler, (Alquiler) => Alquiler.alquilerRecurso, { cascade: true })
    alquileres: Alquiler[];

    @OneToMany(() => AlquilerMantenimiento, (mantenimiento) => mantenimiento.alquilerRecurso, { cascade: true })
    mantenimientos: AlquilerMantenimiento[];

    @OneToMany(() => Presupuesto, (presupuesto) => presupuesto.alquilerRecurso)
    presupuestos: Presupuesto[];

    @OneToMany(() => AlquilerPrecio, (alquilerPrecio) => alquilerPrecio.alquilerRecurso, { cascade: true })
    precios: AlquilerPrecio[];
}
