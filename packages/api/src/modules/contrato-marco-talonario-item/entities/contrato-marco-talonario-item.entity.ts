import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ContratoMarcoTalonario } from '@/modules/contrato-marco-talonario/entities/contrato-marco-talonario.entity'; // Asegúrate de que la ruta sea correcta
import { Receta } from '@/modules/receta/entities/receta.entity'; // Asegúrate de que la ruta sea correcta
import { BaseEntity } from '@/common/base.entity'; // Si estás usando una clase base

@Entity({ name: 'contrato_marco_talonario_item' })
export class ContratoMarcoTalonarioItem extends BaseEntity {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @ManyToOne(() => ContratoMarcoTalonario, (talonario) => talonario, {
        nullable: false,
    })
    @JoinColumn({ name: 'contrato_marco_talonario_id' })
    contratoMarcoTalonario: ContratoMarcoTalonario;

    @Column({ name: 'contrato_marco_talonario_id', type: 'int' })
    contratoMarcoTalonarioId: number;
    @Column({
        name: 'precio',
        type: 'varchar',
        length: 255,
        nullable: false,
    })
    precio: string;

    @Column({
        name: 'descripcion',
        type: 'text',
        nullable: false,
    })
    descripcion: string;

    @Column({
        name: 'codigo',
        type: 'varchar',
        length: 255,
        nullable: false,
    })
    codigo: string;

    @ManyToOne(() => Receta, (receta) => receta, {
        nullable: false,
        eager: true
    })
    @JoinColumn({ name: 'receta_id', })
    receta: Receta;

    @Column({
        name: 'receta_id',
        type: 'int',
        nullable: false,
    })
    recetaId: number;
    @Column({
        name: 'unidad_medida',
        type: 'varchar',
        length: 255,
        nullable: false,
    })
    unidadMedida: string;
}
