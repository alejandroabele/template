import { BaseEntity } from "@/common/base.entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'inventario_familia' })
export class Categoria extends BaseEntity {
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
