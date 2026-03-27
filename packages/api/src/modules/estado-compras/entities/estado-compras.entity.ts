import { BaseEntity } from '@/common/base.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'estado_compras' })
export class EstadoCompras extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        name: 'codigo',
        type: 'varchar',
        length: 20,
        nullable: false,
        unique: true,
    })
    codigo: string;

    @Column({
        name: 'nombre',
        type: 'varchar',
        length: 50,
        nullable: false,
    })
    nombre: string;

    @Column({
        name: 'tipo',
        type: 'enum',
        enum: ['SOLCOM', 'OFERTA', 'ORDEN_COMPRA'],
        nullable: false,
    })
    tipo: string;
}
