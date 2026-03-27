import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'cliente' })
export class Cliente {
  @PrimaryGeneratedColumn({ name: 'clienteId' })
  id: number;

  @Column({
    name: 'nombre',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  nombre: string;

  @Column({
    name: 'email',
    type: 'varchar',
    length: 70,
    nullable: true,
  })
  email: string;

  @Column({
    name: 'direccion',
    type: 'varchar',
    length: 300,
    nullable: true,
  })
  direccion: string;

  @Column({
    name: 'ciudad',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  ciudad: string;

  @Column({
    name: 'cp',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  codigoPostal: string;

  @Column({
    name: 'tel',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  telefono: string;

  @Column({
    name: 'contacto',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  contacto: string;

  @Column({
    name: 'razon_social',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  razonSocial: string;

  @Column({
    name: 'cuit',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  cuit: string;

  @Column({
    name: 'direccion_fiscal',
    type: 'varchar',
    length: 300,
    nullable: true,
  })
  direccionFiscal: string;

  @Column({
    name: 'tel_contacto',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  telefonoContacto: string;

  @Column({
    name: 'forma_de_pago',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  formaDePago: string;

  @Column({
    name: 'detalles',
    type: 'text',
    nullable: true,
  })
  detalles: string;

  @Column({
    name: 'email_pago_proveedores',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  emailPagoProveedores: string;

  @Column({
    name: 'nombre_contacto_pago_proveedores',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  nombreContactoPagoProveedores: string;

  @Column({
    name: 'telefono_pago_proveedores',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  telefonoPagoProveedores: string;

  @CreateDateColumn({
    name: 'creado',
    type: 'timestamp',
  })
  createdAt: Date;

  // @UpdateDateColumn({ name: 'updated_at', nullable: true, default: null })
  // updateAt?: Date;

  // @Column({ name: 'deleted_at', nullable: true, default: null })
  // deletedAt?: Date;
}
