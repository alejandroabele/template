import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { RecetaInventario } from './receta-inventario.entity';

@Entity('receta')
export class Receta {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255, nullable: false })
    nombre: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    descripcion: string;

    @OneToMany(() => RecetaInventario, (recetaInventario) => recetaInventario.receta, {
        cascade: true,
    })
    productos?: RecetaInventario[];

}
