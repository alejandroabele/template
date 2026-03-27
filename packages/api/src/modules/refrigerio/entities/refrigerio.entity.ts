import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '@/common/base.entity';
import { Persona } from '@/modules/persona/entities/persona.entity';

@Entity({ name: 'refrigerio' })
export class Refrigerio extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'persona_id', type: 'int', nullable: false })
  personaId: number;

  @ManyToOne(() => Persona, { nullable: false })
  @JoinColumn({ name: 'persona_id' })
  persona?: Persona;

  @Column({ name: 'inicio', type: 'varchar', length: 30, nullable: false })
  inicio: string;

  @Column({ name: 'fin', type: 'varchar', length: 30, nullable: true })
  fin?: string;
}
