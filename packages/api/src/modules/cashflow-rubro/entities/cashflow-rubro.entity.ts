import { BaseEntity } from '@/common/base.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { CashflowCategoria } from '@/modules/cashflow-categoria/entities/cashflow-categoria.entity';
import { CashflowAgrupacion } from '@/modules/cashflow-agrupacion/entities/cashflow-agrupacion.entity';

@Entity('cashflow_rubro')
export class CashflowRubro extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ name: 'agrupacion_id', type: 'int', nullable: true })
  agrupacionId: number;

  @ManyToOne(() => CashflowAgrupacion, (agrupacion) => agrupacion.rubros, { nullable: true })
  @JoinColumn({ name: 'agrupacion_id' })
  agrupacion: CashflowAgrupacion;

  @OneToMany(() => CashflowCategoria, (categoria) => categoria.rubro)
  categorias: CashflowCategoria[];
}
