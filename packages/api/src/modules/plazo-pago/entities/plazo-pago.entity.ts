import { BaseEntity } from '@/common/base.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'plazo_pago' })
export class PlazoPago extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        name: 'descripcion',
        type: 'varchar',
        length: 100,
        nullable: false,
    })
    descripcion: string;
}
