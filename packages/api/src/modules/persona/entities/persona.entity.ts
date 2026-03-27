import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '@/common/base.entity';

@Entity({ name: 'persona' })
export class Persona extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'nombre',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  nombre: string;

  @Column({
    name: 'apellido',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  apellido: string;

  @Column({
    name: 'dni',
    type: 'varchar',
    length: 20,
    nullable: false,
  })
  dni: string;

  @Column({
    name: 'fecha_nacimiento',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  fechaNacimiento: string;

  @Column({
    name: 'telefono',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  telefono: string;

  @Column({
    name: 'direccion',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  direccion: string;

  @Column({
    name: 'email',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  email: string;
}
