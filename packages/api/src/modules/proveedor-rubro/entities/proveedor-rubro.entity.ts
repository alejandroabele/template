// proveedor-rubro.entity.ts
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'proveedor_rubro' })
export class ProveedorRubro {
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
