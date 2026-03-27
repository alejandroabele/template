import { BaseEntity } from '@/common/base.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

@Entity('contacto_tipo')
export class ContactoTipo extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  nombre: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  icono: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  color: string;


}
