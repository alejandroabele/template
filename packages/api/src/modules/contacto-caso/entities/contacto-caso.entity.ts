import { BaseEntity } from '@/common/base.entity';
import { Cliente } from '@/modules/cliente/entities/cliente.entity';
import { Usuario } from '@/modules/auth/usuario/entities/usuario.entity';
import { ContactoProximo } from '@/modules/contacto-proximo/entities/contacto-proximo.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity('contacto_caso')
export class ContactoCaso extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  titulo: string;

  @Column({ type: 'int', nullable: true, name: 'cliente_id' })
  clienteId: number;

  @ManyToOne(() => Cliente)
  @JoinColumn({ name: 'cliente_id' })
  cliente: Cliente;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'nombre_contacto' })
  nombreContacto: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'email_contacto' })
  emailContacto: string;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'telefono_contacto' })
  telefonoContacto: string;

  @Column({ type: 'int', nullable: false, name: 'vendedor_id' })
  vendedorId: number;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'vendedor_id' })
  vendedor: Usuario;

  @Column({ type: 'varchar', length: 255, nullable: true })
  notas: string;

  @OneToMany(() => ContactoProximo, (contactoProximo) => contactoProximo.caso)
  contactosProximos: ContactoProximo[];
}
