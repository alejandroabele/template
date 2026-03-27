import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Presupuesto } from '@/modules/presupuesto/entities/presupuesto.entity';
import { Receta } from '@/modules/receta/entities/receta.entity';
import { PresupuestoMateriales } from '@/modules/presupuesto-materiales/entities/presupuesto-materiale.entity';
import { PresupuestoManoDeObra } from '@/modules/presupuesto-mano-de-obra/entities/presupuesto-mano-de-obra.entity';
import { PresupuestoSuministro } from '@/modules/presupuesto-suministros/entities/presupuesto-suministro.entity';
import { ContratoMarcoPresupuestoItem } from '@/modules/contrato-marco-presupuesto-item/entities/contrato-marco-presupuesto-item.entity';
import { BaseEntity } from '@/common/base.entity';

@Entity('presupuesto_h')
export class PresupuestoItem extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Presupuesto, (presupuesto) => presupuesto.id, { nullable: true })
    presupuesto: Presupuesto;

    @Column({ type: 'int', nullable: false })
    presupuestoId: number;

    @Column({ type: 'int', nullable: true, name: 'receta_id' })
    recetaId: number;

    @ManyToOne(() => Receta, (receta) => receta.id, { nullable: true })
    @JoinColumn({ name: 'receta_id' })
    receta: Receta;

    @Column({ type: 'varchar', length: 50, nullable: true })
    tipo: string;

    @Column({ type: 'varchar', length: 300, nullable: true })
    descripcion: string;

    @Column({ type: 'mediumtext', nullable: true })
    detalles: string;

    @Column({ type: 'mediumtext', nullable: true })
    observaciones: string;

    @Column({ type: 'int', default: 0 })
    cantidad: number;

    @Column({ type: 'decimal', precision: 20, scale: 2, default: 0.0, name: 'materiales_costo' })
    materialesCosto: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0, name: 'materiales_comision' })
    materialesComision: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0, name: 'materiales_venta' })
    materialesVenta: number;

    @Column({ type: 'decimal', precision: 20, scale: 2, default: 0.0, name: 'suministros_costo' })
    suministrosCosto: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0, name: 'suministros_comision' })
    suministrosComision: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0, name: 'suministros_venta' })
    suministrosVenta: number;

    @Column({ type: 'decimal', precision: 20, scale: 2, default: 0.0, name: 'manodeobra_costo' })
    manoDeObraCosto: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0, name: 'manodeobra_comision' })
    manoDeObraComision: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0, name: 'manodeobra_venta' })
    manoDeObraVenta: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0, name: 'trabajocampo_costo' })
    trabajoCampoCosto: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0, name: 'trabajocampo_comision' })
    trabajoCampoComision: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0, name: 'trabajocampo_venta' })
    trabajoCampoVenta: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0, name: 'iva_comision' })
    ivaComision: number;

    @Column({ type: 'decimal', precision: 20, scale: 2, default: 0.0 })
    venta: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0, name: 'producto_costo_estimado' })
    productoCostoEstimado: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0, name: 'servicio_costo_estimado' })
    servicioCostoEstimado: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0, name: 'total_costo_estimado' })
    totalCostoEstimado: number;

    @Column({ type: 'date', nullable: true, name: 'fecha_enviado_servicio' })
    fechaEnviadoServicio: Date;

    @Column({ type: 'date', nullable: true, name: 'fecha_estimada_entrega' })
    fechaEstimadaEntrega: Date;

    @Column({ type: 'varchar', length: 250, nullable: true, name: 'direccion_colocacion' })
    direccionColocacion: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    ciudad: string;

    @Column({ type: 'varchar', length: 100, nullable: true, name: 'persona_contacto' })
    personaContacto: string;

    @Column({ type: 'varchar', length: 50, nullable: true, name: 'tel_contacto' })
    telContacto: string;

    @Column({ type: 'varchar', length: 250, nullable: true })
    limpieza: string;

    @Column({ type: 'varchar', length: 100, nullable: true, name: 'horario_trabajar' })
    horarioTrabajar: string;

    @Column({ type: 'varchar', length: 250, nullable: true })
    documentacion: string;

    produccionTrabajos: any;
    materiales: any[];
    suministros: any[];
    manoDeObra: any[];

    @OneToMany(
        () => ContratoMarcoPresupuestoItem,
        (cm) => cm.presupuestoItem,
    )
    contratoMarcoPresupuestoItems: ContratoMarcoPresupuestoItem[]
}

interface ProduccionTrabajo {
    id: number;
    nombre: string;
    tipo: string;
    materiales: PresupuestoMateriales[];
    suministros: PresupuestoSuministro[];
    manoDeObra: PresupuestoManoDeObra[];
}
