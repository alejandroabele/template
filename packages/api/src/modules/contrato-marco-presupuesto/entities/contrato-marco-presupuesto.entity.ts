import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Presupuesto } from '@/modules/presupuesto/entities/presupuesto.entity';
import { BaseEntity } from '@/common/base.entity';
import { ContratoMarco } from '@/modules/contrato-marco/entities/contrato-marco.entity'
import { ContratoMarcoPresupuestoItem } from '@/modules/contrato-marco-presupuesto-item/entities/contrato-marco-presupuesto-item.entity'
@Entity({ name: 'contrato_marco_presupuesto' })
export class ContratoMarcoPresupuesto extends BaseEntity {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @ManyToOne(() => ContratoMarco, { nullable: true })
    @JoinColumn({ name: 'contrato_marco_id' })
    contratoMarco: ContratoMarco;

    @Column({ name: 'contrato_marco_id', type: 'int', nullable: true })
    contratoMarcoId: number;

    @Column({ name: 'estado', type: 'varchar', length: 255 })
    estado: string;

    @Column({ name: 'tipo', type: 'varchar', length: 255 })
    tipo: string;

    @ManyToOne(() => Presupuesto, { nullable: true, cascade: true })
    @JoinColumn({ name: 'presupuesto_id' })
    presupuesto: Presupuesto;

    @Column({ name: 'presupuesto_id', type: 'int', nullable: true })
    presupuestoId: number;

    @OneToMany(() => ContratoMarcoPresupuestoItem, item => item.contratoMarcoPresupuesto, {
        cascade: true,
        eager: true, // o true, según tu caso
    })
    items: ContratoMarcoPresupuestoItem[];
}
