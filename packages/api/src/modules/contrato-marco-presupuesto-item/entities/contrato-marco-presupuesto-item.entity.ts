import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ContratoMarcoTalonarioItem } from '@/modules/contrato-marco-talonario-item/entities/contrato-marco-talonario-item.entity';
import { BaseEntity } from '@/common/base.entity';
import { ContratoMarcoPresupuesto } from '@/modules/contrato-marco-presupuesto/entities/contrato-marco-presupuesto.entity'
import { PresupuestoItem } from '@/modules/presupuesto-item/entities/presupuesto-item.entity';

@Entity({ name: 'contrato_marco_presupuesto_item' })
export class ContratoMarcoPresupuestoItem extends BaseEntity {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @ManyToOne(() => ContratoMarcoPresupuesto, { nullable: true })
    @JoinColumn({ name: 'contrato_marco_presupuesto_id' })
    contratoMarcoPresupuesto: ContratoMarcoPresupuesto;

    @Column({ name: 'contrato_marco_presupuesto_id', type: 'int', nullable: true })
    contratoMarcoPresupuestoId: number;

    @ManyToOne(() => ContratoMarcoTalonarioItem, { nullable: true, eager: true })
    @JoinColumn({ name: 'contrato_marco_talonario_item_id' })
    contratoMarcoTalonarioItem: ContratoMarcoTalonarioItem;

    @Column({ name: 'contrato_marco_talonario_item_id', type: 'int', nullable: true })
    contratoMarcoTalonarioItemId: number;

    @Column({ name: 'cantidad', type: 'varchar', length: 255, nullable: true })
    cantidad: string;

    @Column({ name: 'alto', type: 'varchar', length: 255, nullable: true })
    alto: string;

    @Column({ name: 'ancho', type: 'varchar', length: 255, nullable: true })
    ancho: string;
    // Nueva relación con PresupuestoItem
    @ManyToOne(() => PresupuestoItem, { nullable: true, eager: true, cascade: true })
    @JoinColumn({ name: 'presupuesto_item_id' })
    presupuestoItem: PresupuestoItem;

    @Column({ name: 'presupuesto_item_id', type: 'int', nullable: true })
    presupuestoItemId: number;
}
