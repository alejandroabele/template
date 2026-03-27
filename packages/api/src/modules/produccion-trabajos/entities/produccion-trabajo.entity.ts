import {
    Entity,
    PrimaryGeneratedColumn,
    Column
} from 'typeorm';

@Entity('produccion_trabajos')
export class ProduccionTrabajo {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        name: 'nombre',
        type: 'varchar',
        length: 50,
        nullable: false,
    })
    nombre: string;


    @Column({
        name: 'orden',
        type: 'int',
        nullable: true,
    })
    orden?: number;

    @Column({
        name: 'tipo',
        type: 'varchar',
        length: 50,
        nullable: false,
    })
    tipo: string;

    @Column({
        name: 'color',
        type: 'varchar',
        length: 50,
        nullable: false,
    })
    color: string;


}
