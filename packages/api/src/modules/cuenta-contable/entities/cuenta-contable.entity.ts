import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '@/common/base.entity';

@Entity('cuenta_contable')
export class CuentaContable extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20, unique: true })
  codigo: string;

  @Column({ type: 'varchar', length: 100 })
  descripcion: string;

  @Column({ type: 'enum', enum: ['activo', 'pasivo', 'patrimonio', 'ingreso', 'gasto'] })
  tipo: 'activo' | 'pasivo' | 'patrimonio' | 'ingreso' | 'gasto';
}
