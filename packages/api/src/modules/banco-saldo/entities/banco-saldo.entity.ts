import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Banco } from '../../banco/entities/banco.entity';

@Entity({ name: 'banco_saldo' })
export class BancoSaldo {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        name: 'monto',
        type: 'decimal',
        precision: 15,
        scale: 2,
        nullable: false,
    })
    monto: number;

    @Column({
        name: 'fecha',
        type: 'date',
        nullable: false,
    })
    fecha: string;

    @Column({
        name: 'banco_id',
        type: 'int',
        nullable: false,
    })
    bancoId: number;

    @ManyToOne(() => Banco, banco => banco.saldos)
    @JoinColumn({ name: 'banco_id' })
    banco: Banco;

    @Column({
        name: 'descubierto_uso',
        type: 'decimal',
        precision: 15,
        scale: 2,
        nullable: true,
    })
    descubiertoUso: number;

    @Column({
        name: 'descubierto_monto',
        type: 'decimal',
        precision: 15,
        scale: 2,
        nullable: true,
    })
    descubiertoMonto: number;


}
