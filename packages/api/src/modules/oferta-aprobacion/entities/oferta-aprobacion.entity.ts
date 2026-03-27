import { BaseEntity } from '@/common/base.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Oferta } from '@/modules/oferta/entities/oferta.entity';
import { AprobacionOfertaTipo } from './aprobacion-oferta-tipo.entity';
import { Usuario } from '@/modules/auth/usuario/entities/usuario.entity';

@Entity({ name: 'oferta_aprobacion' })
export class OfertaAprobacion extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        name: 'oferta_id',
        type: 'int',
        nullable: false,
    })
    ofertaId: number;

    @Column({
        name: 'oferta_aprobacion_tipo_id',
        type: 'int',
        nullable: false,
    })
    ofertaAprobacionTipoId: number;

    @Column({
        name: 'aprobador_id',
        type: 'int',
        nullable: true,
    })
    aprobadorId: number;

    @Column({
        name: 'fecha_aprobacion',
        type: 'varchar',
        length: 10,
        nullable: true,
    })
    fechaAprobacion: string;

    @Column({
        name: 'motivo',
        type: 'varchar',
        length: 255,
        nullable: true,
    })
    motivo: string;

    @Column({
        name: 'estado',
        type: 'enum',
        enum: ['PENDIENTE', 'APROBADO', 'RECHAZADO'],
        default: 'PENDIENTE',
        nullable: false,
    })
    estado: string;

    // Relaciones
    @ManyToOne(() => Oferta, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'oferta_id' })
    oferta: Oferta;

    @ManyToOne(() => AprobacionOfertaTipo)
    @JoinColumn({ name: 'oferta_aprobacion_tipo_id' })
    ofertaAprobacionTipo: AprobacionOfertaTipo;

    @ManyToOne(() => Usuario)
    @JoinColumn({ name: 'aprobador_id' })
    aprobador: Usuario;
}
