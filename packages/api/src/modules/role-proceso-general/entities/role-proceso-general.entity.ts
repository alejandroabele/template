import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Role } from '../../auth/role/entities/role.entity';
import { ProcesoGeneral } from '../../proceso-general/entities/proceso-general.entity';

@Entity({ name: 'role_proceso_general' })
export class RoleProcesoGeneral {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'role_id',
    type: 'int',
    nullable: false,
  })
  roleId: number;

  @Column({
    name: 'proceso_general_id',
    type: 'int',
    nullable: false,
  })
  procesoGeneralId: number;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @ManyToOne(() => ProcesoGeneral)
  @JoinColumn({ name: 'proceso_general_id' })
  procesoGeneral: ProcesoGeneral;
}
