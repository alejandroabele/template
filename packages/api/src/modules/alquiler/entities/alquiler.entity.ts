import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Cliente } from '@/modules/cliente/entities/cliente.entity'
import { AlquilerRecurso } from '@/modules/alquiler-recurso/entities/alquiler-recurso.entity'

@Entity('alquiler')
export class Alquiler {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    localidad: string;

    @Column({ type: 'varchar', length: 255 })
    zona: string;

    @Column({ type: 'point', nullable: true })
    coordenadas?: string;


    @Column({ type: 'date', name: "inicio_contrato", nullable: true })
    inicioContrato: Date;

    @Column({ type: 'date', name: 'vencimiento_contrato', nullable: true })
    vencimientoContrato: Date;

    @Column({
        name: 'precio',
        type: 'int',
        nullable: true,
    })
    precio?: number;

    @Column({ type: 'varchar', length: 255 })
    estado: 'LIBRE' | 'ARRENDADO' | 'EN_NEGOCIACION';

    @Column({ type: 'date', nullable: true, name: 'fecha_limite_negociacion' })
    fechaLimiteNegociacion?: Date;

    @Column({ type: 'text', nullable: true })
    notas?: string;

    @Column({ type: 'varchar', length: 255 })
    tipo: 'FLOTA' | 'TRAILERS' | 'CARTELES' | 'EQUIPAMIENTO';

    // @OneToMany(() => AlquilerPrecio, (alquilerPrecio) => alquilerPrecio.alquiler, { cascade: true })
    // precios: AlquilerPrecio[];




    @ManyToOne(() => Cliente, cliente => cliente.id)
    @JoinColumn({ name: 'cliente_id' })
    cliente: Cliente;

    @Column({
        name: 'cliente_id',
        nullable: true,
    })
    clienteId: number;

    @ManyToOne(() => AlquilerRecurso, recurso => recurso.id)
    @JoinColumn({ name: 'alquiler_recurso_id' })
    alquilerRecurso: AlquilerRecurso;

    @Column({
        name: 'alquiler_recurso_id',
        nullable: false,
    })
    alquilerRecursoId: number;


    estadoFacturacion?: string
    estadoCobranza?: string

    // Relaciones polimórficas - se cargan manualmente en el service
    // No se pueden usar @OneToMany porque modelo_id no es una FK real

    @Column({ type: 'varchar', length: 10, name: 'periodicidad_actualizacion' })
    periodicidadActualizacion: '1' | '3' | '6' | '12';

}
