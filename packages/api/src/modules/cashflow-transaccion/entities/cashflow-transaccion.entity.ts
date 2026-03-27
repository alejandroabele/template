import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn
} from 'typeorm';
import { CashflowCategoria } from '@/modules/cashflow-categoria/entities/cashflow-categoria.entity';
import { Banco } from '@/modules/banco/entities/banco.entity';
import { BaseEntity } from '@/common/base.entity';

@Entity('cashflow_transaccion')
export class CashflowTransaccion extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

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
        name: 'modelo',
        type: 'varchar',
        length: 100,
        nullable: true,
    })
    modelo?: string;

    @Column({
        name: 'modelo_id',
        type: 'int',
        nullable: true,
    })
    modeloId?: number;

    @Column({
        name: 'proyectado',
        type: 'boolean',
        default: false,

    })
    proyectado: boolean;

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

    @ManyToOne(() => CashflowCategoria)
    @JoinColumn({ name: 'categoria_id' })
    categoria: CashflowCategoria;

    @ManyToOne(() => Banco)
    @JoinColumn({ name: 'banco_id' })
    banco: Banco;
}
