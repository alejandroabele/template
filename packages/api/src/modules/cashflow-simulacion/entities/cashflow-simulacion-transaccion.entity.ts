import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@/common/base.entity';
import { CashflowSimulacion } from './cashflow-simulacion.entity';
import { CashflowCategoria } from '@/modules/cashflow-categoria/entities/cashflow-categoria.entity';
import { Banco } from '@/modules/banco/entities/banco.entity';

@Entity('cashflow_simulacion_transaccion')
export class CashflowSimulacionTransaccion extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        name: 'simulacion_id',
        type: 'int',
        nullable: false,
    })
    simulacionId: number;

    @Column({
        name: 'categoria_id',
        type: 'int',
        nullable: false,
    })
    categoriaId: number;

    @Column({
        name: 'fecha',
        type: 'varchar',
        length: 255,
        nullable: false,
    })
    fecha: string;

    @Column({
        name: 'monto',
        type: 'decimal',
        precision: 18,
        scale: 2,
        nullable: false,
    })
    monto: number;

    @Column({
        name: 'descripcion',
        type: 'text',
        nullable: true,
    })
    descripcion?: string;

    @Column({
        name: 'banco_id',
        type: 'int',
        nullable: true,
    })
    bancoId?: number;

    @Column({
        name: 'conciliado',
        type: 'boolean',
        default: false,
    })
    conciliado: boolean;

    @ManyToOne(() => CashflowSimulacion, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'simulacion_id' })
    simulacion: CashflowSimulacion;

    @ManyToOne(() => CashflowCategoria)
    @JoinColumn({ name: 'categoria_id' })
    categoria: CashflowCategoria;

    @ManyToOne(() => Banco)
    @JoinColumn({ name: 'banco_id' })
    banco: Banco;
}
