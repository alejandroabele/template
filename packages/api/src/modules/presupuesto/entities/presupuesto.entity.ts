import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    OneToMany,
} from 'typeorm';
import { Cliente } from '@/modules/cliente/entities/cliente.entity';
import { Usuario } from '@/modules/auth/usuario/entities/usuario.entity';
import { Area } from '@/modules/area/entities/area.entity';
import { ProcesoGeneral } from '@/modules/proceso-general/entities/proceso-general.entity';
// import { ViaPublica } from './viapublica.entity';
import { PresupuestoItem } from '@/modules/presupuesto-item/entities/presupuesto-item.entity';
import { PresupuestoProduccion } from '@/modules/presupuesto-produccion/entities/presupuesto-produccion.entity'; // Asegúrate de importar tu entidad
import { AlquilerRecurso } from '@/modules/alquiler-recurso/entities/alquiler-recurso.entity';
import { ContactoCaso } from '@/modules/contacto-caso/entities/contacto-caso.entity';

@Entity('presupuesto')
export class Presupuesto {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'date', nullable: false })
    fecha: Date;

    @ManyToOne(() => Cliente, (cliente) => cliente.id, { nullable: true })
    @JoinColumn({ name: 'clienteId' })
    cliente: Cliente;

    @Column({ type: 'int', nullable: true })
    clienteId: number;

    @Column({ type: 'varchar', length: 100, nullable: true })
    comprador: string;

    @ManyToOne(() => Usuario, { nullable: true })
    @JoinColumn({ name: 'vendedorId' })
    vendedor: Usuario;
    @Column({ type: 'int', nullable: true })
    vendedorId: number;

    @ManyToOne(() => Area, { nullable: true })
    @JoinColumn({ name: 'areaId' })
    area: Area;
    @Column({ type: 'int', nullable: true })
    areaId: number;

    @Column({ type: 'varchar', length: 250, nullable: true, name: 'descripcion_corta' })
    descripcionCorta: string;

    @Column({ type: 'varchar', length: 250, nullable: true })
    diseno: string;

    @Column({ type: 'tinyint', default: 0, name: 'diseno_solicitar' })
    disenoSolicitar: boolean;

    @Column({ name: "diseno_estatus", type: 'varchar', length: 20, nullable: true })
    disenoEstatus: string;

    @Column({ name: "diseno_ubicacion", type: 'varchar', length: 100, nullable: true })
    disenoUbicacion: string;


    @Column({ name: "costeo_estatus", type: 'varchar', length: 20, nullable: true })
    costeoEstatus: string;
    @Column({ name: "costeo_comercial_estatus", type: 'varchar', length: 20, nullable: true })
    costeoComercialEstatus: string;

    @Column({ name: "facturacion_estatus", type: 'varchar', length: 20, nullable: true })
    facturacionEstatus: string;
    @Column({ name: "cobranza_estatus", type: 'varchar', length: 20, nullable: true })
    cobranzaEstatus: string;

    @Column({ name: "produccion_estatus", type: 'varchar', length: 20, nullable: true })
    produccionEstatus: string;

    @Column({ type: 'date', nullable: true, name: "fecha_entrega_estimada" })
    fechaEntregaEstimada: Date;

    @Column({ type: 'int', default: 0, name: "progreso_produccion" })
    progreso: number;
    @Column({ type: 'int', default: 0 })
    proyeccion: number;

    @Column({ type: 'int', default: 0, name: "progreso_servicio" })
    progresoServicio: number;

    @ManyToOne(() => ProcesoGeneral, { nullable: true, eager: true })
    @JoinColumn({ name: 'proceso_generalId' })
    procesoGeneral: ProcesoGeneral;

    @Column({ type: 'int', nullable: true, name: 'proceso_generalId' })
    procesoGeneralId: number;

    @Column({ type: 'decimal', precision: 20, scale: 2, default: 0.0 })
    total: number;

    @Column({ type: 'decimal', precision: 20, scale: 2, default: 0.0, name: 'venta_total' })
    ventaTotal: number;

    @Column({ type: 'decimal', precision: 20, scale: 2, default: 0.0, name: 'costo_total' })
    costoTotal: number;

    @Column({ type: 'tinyint', default: 0 })
    facturado: number;

    @Column({ type: 'datetime', nullable: true })
    lastupdate: Date;

    @Column({ type: 'varchar', length: 100, nullable: true, name: 'condicion_iva' })
    condicionIva: string;

    @Column({ type: 'varchar', length: 100, nullable: true, name: 'condicion_pago' })
    condicionPago: string;
    @Column({ type: 'varchar', length: 100, nullable: true, name: 'mant_oferta' })
    mantOferta: string;

    @Column({ type: 'varchar', length: 100, nullable: true, name: 'tiempo_entrega' })
    tiempoEntrega: string;

    @Column({ type: 'varchar', length: 100, nullable: true, name: 'lugar_entrega' })
    lugarEntrega: string;

    @Column({ type: 'varchar', length: 30, nullable: true })
    moneda: string;

    @Column({ type: 'mediumtext', nullable: true, name: 'descripcion_global' })
    descripcionGlobal: string;

    @Column({ type: 'tinyint', default: 0 })
    hayServicio: number;

    @Column({ type: 'tinyint', default: 0 })
    hayProducto: number;

    @Column({ type: 'decimal', precision: 20, scale: 2, default: 7.0, name: 'estructura_comision' })
    estructuraComision: number;
    @Column({ type: 'decimal', precision: 20, scale: 2, default: 0.0, name: 'estructura_costo' })
    estructuraCosto: number;

    @Column({ type: 'decimal', precision: 20, scale: 2, default: 2.0, name: 'vendedor_comision' })
    vendedorComision: number;
    @Column({ type: 'decimal', precision: 20, scale: 2, default: 0.0, name: 'vendedor_costo' })
    vendedorCosto: number;

    @Column({ type: 'decimal', precision: 20, scale: 2, default: 0.0, name: 'director_comision' })
    directorComision: number;
    @Column({ type: 'decimal', precision: 20, scale: 2, default: 0.0, name: 'director_costo' })
    directorCosto: number;


    @Column({ type: 'decimal', precision: 20, scale: 2, default: 0.0, name: 'costoadmin_total' })
    costoAdminTotal: number;

    @Column({ type: 'decimal', precision: 20, scale: 2, default: 3.0, name: 'tax_ingresos_comision' })
    taxIngresosComision: number;
    @Column({ type: 'decimal', precision: 20, scale: 2, default: 0.0, name: 'tax_ingresos_costo' })
    taxIngresosCosto: number;

    @Column({ type: 'decimal', precision: 20, scale: 2, default: 1.2, name: 'tax_transf_comision' })
    taxTransfComision: number;
    @Column({ type: 'decimal', precision: 20, scale: 2, default: 0.0, name: 'tax_transf_costo' })
    taxTransfCosto: number;
    @Column({ type: 'decimal', precision: 20, scale: 2, default: 20.0, name: 'tax_ganancias_comision' })
    taxGananciasComision: number;
    @Column({ type: 'decimal', precision: 20, scale: 2, default: 0.0, name: 'tax_ganancias_costo' })
    taxGananciasCosto: number;
    @Column({ type: 'decimal', precision: 20, scale: 2, default: 0.0, name: 'tax_total' })
    taxTotal: number;
    @Column({ type: 'decimal', precision: 20, scale: 2, default: 0.0, name: 'contrib_marginal' })
    contribucionMarginal: number;
    @Column({ type: 'decimal', precision: 20, scale: 2, default: 0.0, name: 'margen_total' })
    margenTotal: number;
    @Column({ type: 'decimal', precision: 20, scale: 2, default: 0.0, name: 'bab' })
    bab: number;
    //    // Relación con PresupuestoItem
    //     @OneToMany(() => PresupuestoItem, (presupuestoItem) => presupuestoItem.presupuesto, { cascade: true })
    //     items: PresupuestoItem[]; 

    @Column({ type: 'date', nullable: true, name: 'fecha_entregado' })
    fechaEntregado: string;
    // Nueva relación con PresupuestoProduccion
    @OneToMany(() => PresupuestoProduccion, (presupuestoProduccion) => presupuestoProduccion.presupuesto, {
        cascade: true, // Opcional: permite operaciones en cascada
        onDelete: 'CASCADE' // Opcional: borrado en cascada
    })
    producciones: PresupuestoProduccion[];

    produccionesPorcentaje: number;

    @Column({ type: 'date', nullable: true, name: 'fecha_solicitud_prod' })
    fechaRecepcionAlmacen: string;

    @Column({ type: 'date', nullable: true, name: 'fecha_inicio_prod' })
    fechaVerificacionAlmacen: string;
    @Column({ type: 'decimal', precision: 20, scale: 2, default: 0.0, name: 'monto_facturado' })
    montoFacturado: number;

    @Column({ type: 'decimal', precision: 20, scale: 2, default: 0.0, name: 'monto_cobrado' })
    montoCobrado: number;

    @Column({ type: 'decimal', precision: 20, scale: 2, default: 0.0, name: 'monto_retenciones' })
    montoRetenciones: number;

    @ManyToOne(() => AlquilerRecurso, { nullable: true, onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'alquiler_recurso_id' })
    alquilerRecurso: AlquilerRecurso;

    @Column({ type: 'int', nullable: true, name: 'alquiler_recurso_id' })
    alquilerRecursoId: number;

    @Column({ type: 'boolean', default: false, name: 'ignorar_stock' })
    ignorarStock: boolean;

    @Column({ type: 'date', nullable: true, name: "fecha_fabricacion" })
    fechaFabricacion: Date;

    @Column({ type: 'date', nullable: true, name: "fecha_fabricacion_estimada" })
    fechaFabricacionEstimada: Date;
    @Column({ type: 'date', nullable: true, name: 'fecha_inicio_serv' })
    fechaVerificacionServicio: string;

    @OneToMany(() => PresupuestoItem, (presupuestoItem) => presupuestoItem.presupuesto, {
        cascade: true,
        onDelete: 'CASCADE',
        eager: false,
    })
    items?: PresupuestoItem[];

    @ManyToOne(() => ContactoCaso, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'contacto_caso_id' })
    contactoCaso: ContactoCaso;

    @Column({ type: 'int', nullable: true, name: 'contacto_caso_id' })
    contactoCasoId: number;
}
