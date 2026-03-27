import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ContratoMarco } from '@/modules/contrato-marco/entities/contrato-marco.entity'; // Asegúrate de que la ruta es correcta
import { ContratoMarcoTalonarioItem } from '@/modules/contrato-marco-talonario-item/entities/contrato-marco-talonario-item.entity'; // Asegúrate de que la ruta es correcta
import { BaseEntity } from '@/common/base.entity'; // Si estás usando una clase base

@Entity({ name: 'contrato_marco_talonario' })
export class ContratoMarcoTalonario extends BaseEntity {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @ManyToOne(() => ContratoMarco, (contratoMarco) => contratoMarco, {
        nullable: false,
    })
    @JoinColumn({ name: 'contrato_marco_id' })
    contratoMarco: ContratoMarco;

    @Column({
        name: 'fecha_inicio',
        type: 'date',
        nullable: false,
    })
    fechaInicio: string;

    @Column({
        name: 'fecha_fin',
        type: 'date',
        nullable: false,
    })
    fechaFin: string;

    @Column({
        name: 'contrato_marco_id',
        type: 'number',
        nullable: false,
    })
    contratoMarcoId: string;

    @OneToMany(
        () => ContratoMarcoTalonarioItem,
        (item) => item.contratoMarcoTalonario,
        { cascade: true, eager: true, orphanedRowAction: 'delete' } // Asegúrate de que la relación es correcta
    )
    items: ContratoMarcoTalonarioItem[];


}
