import {
  Column,
  // CreateDateColumn,
  // UpdateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'area' })
export class Area {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'nombre',
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  nombre: string;

  // @CreateDateColumn({
  //   name: 'created_at',
  //   type: 'timestamp',
  // })
  // createdAt: Date;

  // @UpdateDateColumn({ name: 'updated_at', nullable: true, default: null })
  // updateAt?: Date;

  // @Column({ name: 'deleted_at', nullable: true, default: null })
  // deletedAt?: Date;
}
