import { BaseEntity } from '@/common/base.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Presupuesto } from '@/modules/presupuesto/entities/presupuesto.entity';
import { CentroCosto } from '@/modules/centro-costo/entities/centro-costo.entity';
import { EstadoCompras } from '@/modules/estado-compras/entities/estado-compras.entity';
import { Usuario } from '@/modules/auth/usuario/entities/usuario.entity';
import { SolcomItem } from './solcom-item.entity';

@Entity({ name: 'solcom' })
export class Solcom extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Presupuesto, { nullable: true, eager: true })
    @JoinColumn({ name: 'presupuesto_id' })
    presupuesto: Presupuesto;

    @Column({
        name: 'presupuesto_id',
        type: 'int',
        nullable: true,
    })
    presupuestoId: number;

    @ManyToOne(() => CentroCosto, { nullable: true, eager: true })
    @JoinColumn({ name: 'centro_id' })
    centro: CentroCosto;

    @Column({
        name: 'centro_id',
        type: 'int',
        nullable: true,
    })
    centroId: number;

    @Column({
        name: 'descripcion',
        type: 'text',
        nullable: true,
    })
    descripcion: string;

    @Column({
        name: 'fecha_creacion',
        type: 'varchar',
        length: 20,
        nullable: true,
    })
    fechaCreacion: string;

    @Column({
        name: 'fecha_limite',
        type: 'varchar',
        length: 20,
        nullable: true,
    })
    fechaLimite: string;

    @ManyToOne(() => EstadoCompras, { nullable: true, eager: true })
    @JoinColumn({ name: 'estado_id' })
    estado: EstadoCompras;

    @Column({
        name: 'estado_id',
        type: 'int',
        nullable: true,
    })
    estadoId: number;

    @ManyToOne(() => Usuario, { nullable: true, eager: true })
    @JoinColumn({ name: 'usuario_solicitante' })
    usuarioSolicitante: Usuario;

    @Column({
        name: 'usuario_solicitante',
        type: 'int',
        nullable: true,
    })
    usuarioSolicitanteId: number;

    @OneToMany(() => SolcomItem, (item) => item.solcom, {
        cascade: true,
        onDelete: 'CASCADE',
        eager: true,
    })
    items: SolcomItem[];
}
