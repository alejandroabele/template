import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { BaseEntity } from '@/common/base.entity';

@Entity('cashflow_simulacion')
export class CashflowSimulacion extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        name: 'nombre',
        type: 'varchar',
        length: 255,
        nullable: false,
    })
    nombre: string;

    @Column({
        name: 'descripcion',
        type: 'text',
        nullable: true,
    })
    descripcion?: string;

    @Column({
        name: 'tipo',
        type: 'varchar',
        length: 50,
        nullable: false,
    })
    tipo: 'desde_cero' | 'desde_actual';
}
