import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Cliente } from '@/modules/cliente/entities/cliente.entity';
import { BaseEntity } from '@/common/base.entity';
import { ContratoMarcoTalonario } from '@/modules/contrato-marco-talonario/entities/contrato-marco-talonario.entity'
@Entity({ name: 'contrato_marco' })
export class ContratoMarco extends BaseEntity {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @ManyToOne(() => Cliente, (cliente) => cliente)
    @JoinColumn({
        name: 'cliente_id',
        referencedColumnName: 'id',
    })
    cliente: Cliente;

    @Column({
        name: 'cliente_id',
        nullable: true,
    })
    clienteId: number;

    @Column({
        name: 'fecha_inicio',
        type: 'date',
        nullable: false,
    })
    fechaInicio: Date;

    @Column({
        name: 'fecha_fin',
        type: 'date',
        nullable: false,
    })
    fechaFin: Date;

    @Column({
        name: 'nro_contrato',
        type: 'varchar',
        length: 255,
        nullable: false,
    })
    nroContrato: string;

    @Column({
        name: 'observaciones',
        type: 'text',
        nullable: true,
    })
    observaciones: string;

    @Column({
        name: 'periodicidad_actualizacion',
        type: 'varchar',
        length: 255,
        nullable: true,
    })
    periodicidadActualizacion: string;

    @Column({
        name: 'term_de_pago',
        type: 'varchar',
        length: 255,
        nullable: true,
    })
    termDePago: string;

    @Column({
        name: 'monto',
        type: 'varchar',
        length: 255,
        nullable: true,
    })
    monto: string;

    @OneToMany(
        () => ContratoMarcoTalonario,
        (item) => item.contratoMarco,
        { cascade: true, eager: true } // Asegúrate de que la relación es correcta
    )
    talonarios: ContratoMarcoTalonario[];
}
