import { BaseEntity } from '@/common/base.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { CashflowRubro } from '@/modules/cashflow-rubro/entities/cashflow-rubro.entity';

@Entity('cashflow_agrupacion')
export class CashflowAgrupacion extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'enum', enum: ['ingreso', 'egreso'] })
  tipo: 'ingreso' | 'egreso';

  @Column({ type: 'int', default: 0 })
  orden: number;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @OneToMany(() => CashflowRubro, (rubro) => rubro.agrupacion)
  rubros: CashflowRubro[];
}
