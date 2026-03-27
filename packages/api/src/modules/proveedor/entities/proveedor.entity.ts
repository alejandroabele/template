// proveedor.entity.ts
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { ProveedorRubro } from '@/modules/proveedor-rubro/entities/proveedor-rubro.entity';
import { BaseEntity } from '@/common/base.entity';

@Entity({ name: 'proveedor' })
export class Proveedor extends BaseEntity {
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
        name: 'cuit',
        type: 'varchar',
        length: 20,
        nullable: false,
    })
    cuit: string;

    @Column({
        name: 'razon_social',
        type: 'varchar',
        length: 100,
        nullable: false,
    })
    razonSocial: string;

    @Column({
        name: 'nombre_fantasia',
        type: 'varchar',
        length: 100,
        nullable: true,
    })
    nombreFantasia: string;

    @Column({
        name: 'domicilio',
        type: 'varchar',
        length: 100,
        nullable: false,
    })
    domicilio: string;

    @Column({
        name: 'localidad',
        type: 'varchar',
        length: 50,
        nullable: false,
    })
    localidad: string;

    @Column({
        name: 'telefono_contacto_1',
        type: 'varchar',
        length: 20,
        nullable: false,
    })
    telefonoContacto1: string;

    @Column({
        name: 'telefono_contacto_2',
        type: 'varchar',
        length: 20,
        nullable: true,
    })
    telefonoContacto2: string;

    @Column({
        name: 'email',
        type: 'varchar',
        length: 100,
        nullable: false,
    })
    email: string;

    @Column({
        name: 'numero_ingresos_brutos',
        type: 'varchar',
        length: 30,
        nullable: true,
    })
    numeroIngresosBrutos: string;

    @Column({
        name: 'notas',
        type: 'text',
        nullable: true,
    })
    notas: string;

    @Column({
        name: 'condicion_frente_iva',
        type: 'varchar',
        length: 50,
        nullable: false,
    })
    condicionFrenteIva: string;

    @ManyToOne(() => ProveedorRubro, (rubro) => rubro)
    @JoinColumn({
        name: 'proveedor_rubro_id',
        referencedColumnName: 'id',
    })
    proveedorRubro: ProveedorRubro;

    @Column({
        name: 'proveedor_rubro_id',
        type: 'int',
        nullable: true,
    })
    proveedorRubroId: number;

    @Column({
        name: 'web',
        type: 'varchar',
        length: 255,
        nullable: true,
    })
    web: string;

    @Column({
        name: 'contacto_cobranzas_nombre',
        type: 'varchar',
        length: 100,
        nullable: true,
    })
    contactoCobranzasNombre: string;

    @Column({
        name: 'contacto_cobranzas_email',
        type: 'varchar',
        length: 100,
        nullable: true,
    })
    contactoCobranzasEmail: string;

    @Column({
        name: 'contacto_cobranzas_telefono',
        type: 'varchar',
        length: 20,
        nullable: true,
    })
    contactoCobranzasTelefono: string;
}
