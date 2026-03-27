
import {
    Column,
    // CreateDateColumn,
    // UpdateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'indice' })
export class Indice {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        name: 'nombre',
        type: 'varchar',
        length: 50,
        nullable: false,
    })
    nombre: string;

    @Column({ type: 'text', nullable: true, name: 'notas' })
    notas: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
    porcentaje: number;

    // @CreateDateColumn({
    //   name: 'created_at',
    //   type: 'timestamp',
    // })
    // createdAt: Date;

    // @UpdateDateColumn({ name: 'updated_at', nullable: true, default: null })
    // updateAt?: Date;

    // @Column({ name: 'deleted_at', nullable: true, default: null })
    // deletedAt?: Date;
}
