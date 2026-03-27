import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('presupuesto_item_trabajos')
export class PresupuestoItemTrabajo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', name: 'presupuesto_item_id' })
  presupuestoItemId: number;

  @Column({ type: 'int', name: 'trabajo_id' })
  trabajoId: number;
}
