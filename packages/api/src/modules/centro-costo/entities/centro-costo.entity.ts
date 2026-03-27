import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { BaseEntity } from '@/common/base.entity';

@Entity({ name: 'centro_costo' })
export class CentroCosto extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 200 })
    nombre: string;

    @Column({ type: 'varchar', length: 50, unique: true })
    codigo: string;

    @Column({ type: 'text', nullable: true })
    descripcion: string;
}
