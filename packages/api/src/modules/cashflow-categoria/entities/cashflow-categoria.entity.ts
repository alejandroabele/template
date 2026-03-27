import { MetodoPago } from '@/modules/metodo-pago/entities/metodo-pago.entity';
import { CashflowRubro } from '@/modules/cashflow-rubro/entities/cashflow-rubro.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@/common/base.entity';

@Entity({ name: 'cashflow_categoria' })
export class CashflowCategoria extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        name: 'nombre',
        type: 'varchar',
        length: 100,
        nullable: false,
    })
    nombre: string;

    @Column({
        name: 'tipo',
        type: 'enum',
        enum: ['ingreso', 'egreso'],
        nullable: false,
    })
    tipo: 'ingreso' | 'egreso';

    @Column({
        name: 'protegida',
        type: 'tinyint',
        nullable: true,
    })
    protegida: boolean;

    @Column({
        name: 'metodo_pago_id',
        type: 'int',
        nullable: false,
    })
    metodoPagoId: number;
    @ManyToOne(() => MetodoPago)
    @JoinColumn({ name: 'metodo_pago_id' })
    metodoPago: MetodoPago;

    @Column({
        name: 'codigo',
        type: 'varchar',
        length: 100,
        nullable: false,
    })
    codigo: string;

    @Column({
        name: 'rubro_id',
        type: 'int',
        nullable: true,
    })
    rubroId: number;

    @ManyToOne(() => CashflowRubro, (rubro) => rubro.categorias)
    @JoinColumn({ name: 'rubro_id' })
    rubro: CashflowRubro;

}
