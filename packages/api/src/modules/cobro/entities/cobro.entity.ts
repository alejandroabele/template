import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@/common/base.entity';
import { Factura } from '@/modules/factura/entities/factura.entity';
import { MetodoPago } from '@/modules/metodo-pago/entities/metodo-pago.entity';
import { Banco } from '@/modules/banco/entities/banco.entity';
import { MoneyColumn } from '@/common/decorators/money-column.decorator';

@Entity('cobro')
export class Cobro extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 50, name: 'modelo' })
    modelo: string; // 'presupuesto' o 'alquiler'

    @Column({ type: 'int', name: 'modelo_id' })
    modeloId: number;

    @MoneyColumn({ name: 'monto', nullable: true })
    monto?: number;

    @Column({ type: 'varchar', length: 255, nullable: true, name: 'fecha' })
    fecha: string;

    @Column({ type: 'int', nullable: true, name: 'factura_id' })
    facturaId: number;

    @ManyToOne(() => Factura, (factura) => factura.cobros, { nullable: true })
    @JoinColumn({ name: 'factura_id' })
    factura: Factura;

    @Column({ type: 'int', nullable: true, name: 'metodo_pago_id' })
    metodoPagoId: number;

    @ManyToOne(() => MetodoPago, (metodoPago) => metodoPago.id, { nullable: true })
    @JoinColumn({ name: 'metodo_pago_id' })
    metodoPago: MetodoPago;

    @Column({ type: 'int', nullable: true, name: 'banco_id' })
    bancoId: number;

    @ManyToOne(() => Banco, (banco) => banco.id, { nullable: true })
    @JoinColumn({ name: 'banco_id' })
    banco: Banco;

    @Column({ type: 'varchar', length: 255, nullable: true, name: 'retenciones' })
    retenciones: string;
}
