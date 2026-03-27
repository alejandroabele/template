import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ContactoCaso } from '@/modules/contacto-caso/entities/contacto-caso.entity';
import { ContactoTipo } from '@/modules/contacto-tipo/entities/contacto-tipo.entity';
import { Usuario } from '@/modules/auth/usuario/entities/usuario.entity';
import { BaseEntity } from '@/common/base.entity';

@Entity('contacto_proximo')
export class ContactoProximo extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', name: 'caso_id' })
  casoId: number;

  @Column({ type: 'int', name: 'vendedor_id' })
  vendedorId: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  fecha: string;

  @Column({ type: 'int', name: 'tipo_id' })
  tipoId: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  nota: string;

  // Relaciones
  @ManyToOne(() => ContactoCaso)
  @JoinColumn({ name: 'caso_id' })
  caso: ContactoCaso;

  @ManyToOne(() => ContactoTipo)
  @JoinColumn({ name: 'tipo_id' })
  tipo: ContactoTipo;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'vendedor_id' })
  vendedor: Usuario;
}
