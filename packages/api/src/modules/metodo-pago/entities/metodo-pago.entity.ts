// proveedor-rubro.entity.ts
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'metodo_pago' })
export class MetodoPago {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        name: 'nombre',
        type: 'varchar',
        length: 50,
        nullable: false,
    })
    nombre: string;


}
