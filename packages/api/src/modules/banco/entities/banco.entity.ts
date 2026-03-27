import {
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { BancoSaldo } from '../../banco-saldo/entities/banco-saldo.entity';

@Entity({ name: 'banco' })
export class Banco {
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
        name: 'alias',
        type: 'varchar',
        length: 100,
        nullable: true,
    })
    alias: string;


    @Column({
        name: 'nro_cuenta',
        type: 'varchar',
        length: 100,
        nullable: true,
    })
    nroCuenta: string;

    @Column({
        name: 'cbu',
        type: 'varchar',
        length: 100,
        nullable: true,
    })
    cbu: string;

    @Column({
        name: 'incluir_en_total',
        type: 'boolean',
        nullable: true,
        default: true,
    })
    incluirEnTotal: boolean;

    @Column({
        name: 'tna',
        type: 'varchar',
        length: 100,
        nullable: true,
    })
    tna: string;

    @OneToMany(() => BancoSaldo, bancoSaldo => bancoSaldo.banco)
    saldos: BancoSaldo[];
}
