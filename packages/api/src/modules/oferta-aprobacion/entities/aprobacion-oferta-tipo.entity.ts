import { BaseEntity } from '@/common/base.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'oferta_aprobacion_tipo' })
export class AprobacionOfertaTipo extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        name: 'codigo',
        type: 'varchar',
        length: 50,
        nullable: false,
    })
    codigo: string;

    @Column({
        name: 'nombre',
        type: 'varchar',
        length: 100,
        nullable: false,
    })
    nombre: string;
}
