import {
    Entity,
    PrimaryGeneratedColumn,
    Column
} from 'typeorm';

@Entity('proceso_general')
export class ProcesoGeneral {

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
        name: 'color',
        type: 'varchar',
        nullable: true,
    })
    color?: string;

}
