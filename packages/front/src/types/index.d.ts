import {
    ColumnFiltersState,
    PaginationState,
    SortingState,
    Table
} from "@tanstack/react-table";

import { ALQUILER_ESTADO, ALQUILER_TIPO } from '@/constants/alquiler';

declare module "@tanstack/react-table" {
    interface ColumnMeta<TData> {
        customFilter?: (table: Table<TData>) => JSX.Element;
        filterVariant?: string;
        filterOptions?: { label: string; value: string }[];
    }
}
export type PaginationParam = {
    pageIndex: number;
    pageSize: number
}
export type OptionsValue = {
    label: string;
    value: string | number
}

export type Query = {
    pagination: PaginationState;
    columnFilters?: ColumnFiltersState
    sorting?: SortingState
    globalFilter?: string
    columnVisibility?: string[]
    solcomId?: number
    enabled?: boolean
}
export type Dato = {
    id?: number;
    fecha: Date;
    comprador: string;
    vendedor: string;
    area: string;
    presupuesto: number;
}
export type Area = {
    id?: number;
    nombre: string
}

export type Persona = {
    id?: number;
    nombre: string;
    apellido: string;
    dni: string;
    fechaNacimiento?: string;
    fotoArchivo?: Archivo;
}

export type JornadaPersona = {
    id?: number;
    jornadaId?: number;
    jornada?: Jornada;
    personaId?: number;
    persona?: Persona;
    produccionTrabajoId?: number;
    produccionTrabajo?: ProduccionTrabajo;
    inicio?: string;
    fin?: string;
    estado?: 'sin_iniciar' | 'en_progreso' | 'completada';
}

export type Refrigerio = {
    id?: number;
    personaId?: number;
    persona?: Persona;
    inicio?: string;
    fin?: string;
}

export type PersonaTrabajo = {
    personaId: number;
    produccionTrabajoId?: number;
}

export type Jornada = {
    id?: number;
    fecha?: string;
    detalle?: string;
    anotaciones?: string;
    cancelado?: number;
    motivoCancelacion?: string;
    presupuestoId?: number;
    presupuesto?: Presupuesto;
    tipo?: string;
    jornadaPersonas?: JornadaPersona[];
    personasIds?: number[];
    personasTrabajos?: PersonaTrabajo[];
    jornadaFlotas?: JornadaFlotaAsignacion[];
    flotas?: FlotaAsignacion[];
    flotaIds?: number[];
    jornadaEquipamientos?: JornadaEquipamiento[];
    equipamientos?: EquipamientoAsignacion[];
    equipamientoIds?: number[];
}

export type Categoria = {
    id?: number;
    nombre: string
}
export type CentroCosto = {
    id?: number;
    nombre: string;
    codigo: string;
    descripcion?: string;
}
export type Comision = {
    id?: number;
    de: string;
    hasta: string;
    comision: string;

}
export type Inventario = {
    id?: number;
    nombre: string;
    punit: number;
    stock: number;
    alerta: number;
    manejaStock: boolean;
    esHerramienta?: boolean;
    categoria?: Categoria;
    categoriaId: number;
    inventarioCategoria?: InventarioCategoria;
    inventarioCategoriaId: number;
    inventarioSubcategoria?: InventarioSubcategoria;
    inventarioSubcategoriaId: number;
    unidadMedida?: string
    // unidadMedida: UnidadMedida;
    // unidadMedidaId: number;
    sku: string;
    descripcion: string;
    stockMinimo: number;
    stockMaximo: number;
    stockReservado: number;
    adjuntos: Archivo[];
    cuentaContableId?: number;
    cuentaContable?: CuentaContable;
    alicuota?: string;


}
export type Cliente = {
    id?: number;
    nombre: string;
    email: string;
    direccion: string;
    ciudad: string;
    codigoPostal: string;
    telefono: string;
    contacto: string;
    razonSocial: string;
    cuit: string;
    direccionFiscal: string;
    telefonoContacto: string;
    formaDePago: string;
    detalles?: string;
    emailPagoProveedores?: string;
    nombreContactoPagoProveedores?: string;
    telefonoPagoProveedores?: string;
    createdAt?: string;
    logo?: Archivo;
}

export type PadronData = {
    cuit: string;
    razonSocial?: string;
    domicilio?: string;
    localidad?: string;
    condicionFrenteIva?: string;
}

export type Usuario = {
    id?: number;
    email: string;
    password?: string | null;
    nombre?: string;
    active?: boolean;
    roleId?: number;
    role?: Role;
    telefono?: string;
    telefonoOtro?: string;
    attemps?: number;
    // DEPRECATED: Mantener por compatibilidad
    permisoId?: number;
    permiso?: Permiso;
}

export type Auditoria = {
    id: number;
    tabla: string;
    columna: string;
    valorAnterior?: string;
    valorNuevo?: string;
    registroId: number;
    usuarioId: number;
    usuario: Usuario;
    fecha: Date;
}

export type Receta = {
    id: number;
    nombre: string;
    descripcion: string;
    produccionTrabajos: ProduccionTrabajos

}

export type ProduccionTrabajos = {
    producto: Trabajo[];
    servicio: Trabajo[];
};
export type Trabajo = {
    id: number;
    nombre: string;
    tipo: string;
    materiales: Item[];
    suministros: Item[];
    manoDeObra: Item[];
    color: string;
};

export type Item = {
    cantidad: number;
    inventario: Inventario;
    inventarioId: number;
    concepto?: string;
    importe: string;
    id: number;
};


export type AlquilerEstado = typeof ALQUILER_ESTADO[number];
export type AlquilerTipo = typeof ALQUILER_TIPO[number];

export type Alquiler = {
    id: number
    localidad: string;
    zona: string;
    coordenadas: string
    fichaTecnic: string;
    contratoPdf: string;
    inicioContrato: string; //TODO: Ver de almacenar formato fecha
    vencimientoContrato: string; //TODO: Ver de almacenar formato fecha
    precio: number
    estado: AlquilerEstado;
    fechaLimiteNegociacion: string; //TODO: Ver de almacenar formato fecha
    notas: string;
    tipo: AlquilerTipo;
    clienteId: number
    cliente: Cliente
    fichaTecnicaArchivo: Archivo;
    contratoArchivo: Archivo;
    alquilerRecursoId: number
    alquilerRecurso: AlquilerRecurso
    periodicidadActualizacion: '1' | '3' | '6' | '12';
    estadoPrecio: 'VIGENTE' | 'VENCIDO' | 'VENCIMIENTO_PROXIMO' | 'VENCIMIENTO_CERCANO'

}

export type Mensaje = {
    id?: number
    tipoId: number;
    tipo: string;
    fecha?: string;
    mensaje?: string;
    usuarioOrigenId: number;
    usuarioOrigenNombre?: string;
    usuarioDestino?: number;
    usuarioDestinoNombre?: string;
    fecha_visto?: string;
    file?: FileViewerProps
}

export type Menu = ItemMenu[]

export interface ItemMenu {
    title: string
    url: string
    icon?: string
    isActive: boolean
    items: Item[]
}

export interface Item {
    title: string
    url: string
}

export interface Team {
    name: stirng
    logo: stirng
    plan: stirng
}

export type AlquilerPrecio = {
    id: number
    alquiler: Alquiler  // TODO: Revisar este tipo, quedo mal tipado, la relacion es con recurso no con alquiler
    precio: number
    fechaDesde: string
    fechaFin: string
    alquilerId: number
    cliente: Cliente
    clienteId: number
    localidad: string;
    zona: string;
}

export type Indice = {
    id?: number;
    nombre: string;
    notas: string;
    porcentaje: number;
}


export type AlquilerCobranzas = {
    id: number
    alquiler: Alquiler
    monto: number
    inicioPeriodo: string
    finPeriodo: string
    cobrado: boolean
    fechaCobro: string
    alquilerId: number
    cliente: Cliente
    clienteId: number
}

export type Factura = {
    id?: number;
    modelo: string; // 'presupuesto' o 'alquiler'
    modeloId: number;
    monto: string;
    montoCobrado?: number; // Calculado automáticamente en backend
    importeBruto?: number;
    alicuota?: string;
    estado?: string; // 'pagado', 'pendiente', 'parcial'
    folio?: string;
    fecha: string;
    fechaVencimiento?: string;
    inicioPeriodo?: string;
    finPeriodo?: string;
    clienteId?: number;
    cliente?: Cliente;
    facturaArchivo?: Archivo;
    cobros?: Cobro[];
    createdAt?: string;
    updatedAt?: string;
}

export type Cobro = {
    id?: number;
    modelo: string; // 'presupuesto' o 'alquiler'
    modeloId: number;
    monto: string;
    fecha?: string;
    facturaId?: number;
    factura?: Factura;
    metodoPagoId?: number;
    metodoPago?: MetodoPago;
    bancoId?: number;
    banco?: Banco;
    retenciones?: string;
    comprobante: Archivo
}

export type PlantillaNotificacion = {
    id?: number;
    nombre: string;
    descripcion?: string;
    asunto?: string;
    cuerpo: string;
    createdAt?: string;
    updatedAt?: string;
}

export type EnvioNotificacion = {
    id?: number;
    plantillaNotificacionId?: number;
    plantilla?: PlantillaNotificacion;
    modelo: string; // 'factura'
    modeloId: number; // ID de la factura
    canal: 'email' | 'whatsapp';
    estado: 'pendiente' | 'enviado' | 'error';
    asuntoResuelto?: string;
    cuerpoResuelto: string;
    fechaEnvio?: string;
    emailDestinatario?: string;
    error?: string;
    createdAt?: string;
    createdBy?: number;
    createdByUser?: { id: number; nombre: string; email: string };
    updatedAt?: string;
    updatedBy?: number;
}

export type Archivo = {
    id?: number;
    nombre?: string;
    nombreArchivo?: string;
    nombreArchivoOriginal?: string;
    url?: string;
    extension?: string;
    modelo: string;
    modeloId: number;
    tipo?: string;
}
export type Cartel = {
    id: number
    recursoId: number
    formato?: string
    alto?: string
    largo?: string
    localidad?: string
    zona?: string
    coordenadas?: string
}

export type Trailer = {
    id: number
    recursoId: number
    formato?: string
    alto?: string
    largo?: string
}

export type AlquilerRecurso = {
    id: number
    alto?: number
    ancho?: number
    largo?: number
    codigo: string;
    localidad?: string;
    precio: number;
    zona?: string;
    coordenadas?: string
    tipo: AlquilerTipo;
    proveedor: string
    modelo?: string
    formato?: string
    inicioContratoSubAlquiler?: string
    vencimientoContratoSubAlquiler?: string
    mantenimientoActivo?: boolean
    otActivaId?: number | null
    estado?: string
    vencimientoContrato?: string | null
    clienteNombre?: string | null
    cartel?: Cartel | null
}

export type User = {
    userId: number;
    nombre: string;
    email: string;
    roleId: number;
    roleName?: string;
    roleColor?: string;
    roleIcon?: string;
}

export type AlquilerMantenimiento = {
    id: number
    alquilerRecurso: AlquilerRecurso
    alquilerRecursoId: number
    costo: number
    fecha: string
    detalle: string
    checklistArchivo: Archivo;
    adjuntos: Archivo[];
}

export type Notificacion = {
    id: number;
    tipoUsuario: number;
    tipoNotificacion?: string;
    usuarioOrigen: number;
    usuarioDestinoId: number;
    fecha?: string;
    nota?: string;
    tipoId?: number;
    tipo?: string;
    fechaVisto?: string
}

export type ReporteFacturacionCobranza = {
    month: string;
    facturados: number;
    cobrados: number
}

export type ReporteCantidadRecursosTipos = {
    tipo: string;
    fill: string;
    alquieres: number;
}
export type ReporteCantidadRecursosEstado = {
    estado: string;
    cantidad: number
}
export type ReporteEstadoConsumoContrato = {
    contratoId: number;
    montoContrato: number;
    consumido: number;
    saldo: number;
    porcentajeConsumido: number;
}
export interface ReporteOrdenesPorTipo {
    tipo: string;   // "producto" | "servicio"
    total: number;
}

export interface CheckAccess {
    success: boolean
    hasPermission: boolean
    user: User
    menu: Menu
    permissions: Permission[]
}

export type Permiso = {
    id: number;
    nombre: string;

}

export type ProduccionTrabajo = {
    id: number;
    nombre: string;
    orden: number
    color?: string;
    tipo: 'producto' | 'servicio' | 'mantenimiento'
}

export type ProcesoGeneral = {
    id: number;
    nombre: string;
    orden: number
    color: string
}

export type Proceso = {
    id: number;
    nombre: string;
}

export type Estatus = {
    id: number;
    nombre: string;
}

export type Orden = {
    id: number;
    fecha: Date;
    presupuestoId: number
    clienteId: number
}

export type PresupuestoItem = {
    id: number
    presupuesto: Presupuesto
    presupuestoId: number
    recetaId: number
    receta: Receta
    tipo?: string
    descripcion: string
}

export type Presupuesto = {
    id?: number;
    tipo?: string | null;
    fecha?: string;
    cliente?: Cliente | null;
    clienteId?: number | null;
    comprador?: string | null;
    vendedor?: Usuario | null;
    vendedorId?: number | null;
    area?: Area | null;
    areaId?: number | null;
    descripcionCorta?: string | null;
    diseno?: string | null;
    disenoSolicitar: boolean;
    disenoEstatus?: string | null;
    disenoUbicacion?: string | null;
    fechaEntregaEstimada?: string | null;
    fechaFabricacionEstimada?: string | null;
    fechaFabricacion?: string | null;
    progreso?: number;
    proyeccion?: number;
    progresoServicio?: number;
    estatus?: Estatus | null;
    estatusId?: number | null;
    proceso?: Proceso | null;
    procesoId?: number | null;
    procesoGeneral?: ProcesoGeneral | null;
    procesoGeneralId?: number | null;
    total?: number;
    ventaTotal?: number;
    costoTotal?: number;
    facturado?: number;
    lastupdate?: Date | null;
    orden?: Orden | null;
    ordenId?: number | null;
    condicion_iva?: string | null;
    condicion_pago?: string | null;
    tiempo_entrega?: string | null;
    lugar_entrega?: string | null;
    moneda?: string | null;
    descripcion_global?: string | null;
    hayServicio?: number;
    hayProducto?: number;
    items?: any[]
    estructuraComision?: number;
    estructuraCosto?: number;
    vendedorComision?: number;
    vendedorCosto?: number;
    directorComision?: number;
    directorCosto?: number;
    costoAdminTotal?: number;
    taxIngresosComision?: number;
    taxIngresosCosto?: number;
    taxTransfComision?: number;
    taxTransfCosto?: number;
    taxGananciasComision?: number;
    taxGananciasCosto?: number;
    taxTotal?: number;
    contribucionMarginal?: number;
    margenTotal?: number;
    bab?: number;
    condicionIva?: string;
    condicionPago?: string;
    tiempoEntrega?: string;
    lugarEntrega?: string;
    mantOferta?: string;
    descripcionGlobal?: string;
    fechaEntregado?: string;
    presupuestoLeido?: boolean
    costeoEstatus?: string | null;
    costeoComercialEstatus?: string | null;
    fechaVerificacionAlmacen?: string
    fechaVerificacionServicio?: string;
    fechaRecepcionAlmacen?: string
    cobranzaEstatus?: string;
    facturacionEstatus?: string;
    produccionEstatus?: string;
    montoFacturado?: number;
    montoCobrado?: number;
    montoRetenciones?: number;
    alquilerRecursoId?: number;
    alquilerRecurso: AlquilerRecurso
    ignorarStock: boolean;
    contactoCasoId?: number;
};
export type PresupuestoLeido = {
    id?: number;
    usuarioId?: number
    presupuestoId: number
    fecha?: string
}

export type CuentaContable = {
    id?: number;
    codigo: string;
    descripcion: string;
    tipo: 'activo' | 'pasivo' | 'patrimonio' | 'ingreso' | 'gasto';
}

export type PresupuestoProduccion = {
    id?: number;
    iniciado?: number
    terminado: number
    fechaIniciado?: string
    fechaTerminado?: string
    presupuesto?: Presupuesto;
    presupuestoId?: number;
    trabajoId?: number;
    trabajo?: ProduccionTrabajo
    estadoOperario?: 'en_progreso' | 'sin_actividad'
    trazabilidadId?: number
    inicio?: string
}


export type PresupuestoCobro = {
    id?: number;
    presupuesto?: Presupuesto;
    presupuestoId?: number;
    fecha?: string
    monto?: string
    retenciones?: string
    cobroArchivo: Archivo
    presupuestoFactura?: Factura;
    presupuestoFacturaId?: number;
    metodoPagoId?: number;
    metodoPago?: MetodoPago;
}

export type UsuarioPermiso = {

    role: Permiso;
    roleId: number;
    usuario: Usuario;
    usuarioId: number;
}

export type UnidadMedida = {
    id: number;
    nombre: string;
}

export type ProveedorRubro = {
    id: number;
    nombre: string;
}

export type MetodoPago = {
    id: number;
    nombre: string;
}

export type EstadoCompras = {
    id: number;
    codigo: string;
    nombre: string;
    tipo: 'SOLCOM' | 'OFERTA' | 'ORDEN_COMPRA';
}

export type AprobacionOfertaTipo = {
    id: number;
    codigo: string;
    nombre: string;
}

export type OfertaAprobacion = {
    id: number;
    ofertaId: number;
    ofertaAprobacionTipoId: number;
    aprobadorId?: number;
    fechaAprobacion?: string;
    motivo?: string;
    estado: 'PENDIENTE' | 'APROBADO' | 'RECHAZADO';
    ofertaAprobacionTipo?: AprobacionOfertaTipo;
    aprobador?: Usuario;
}

export type PlazoPago = {
    id: number;
    descripcion: string;
}

export type SolcomItem = {
    id?: number;
    solcomId?: number;
    inventarioId: number;
    inventario?: Inventario;
    inventarioConversionId?: number;
    inventarioConversion?: InventarioConversion;
    descripcion?: string;
    cantidad?: string;
    minimo?: string;
    maximo?: string;
    compradorId?: number;
    comprador?: Usuario;
    solcom?: Solcom;
    ofertaItems?: OfertaItem[];
}

export type Solcom = {
    id?: number;
    presupuestoId?: number;
    presupuesto?: Presupuesto;
    centroId?: number;
    centro?: CentroCosto;
    descripcion?: string;
    fechaCreacion?: string;
    fechaLimite?: string;
    estadoId?: number;
    estado?: EstadoCompras;
    usuarioSolicitanteId?: number;
    usuarioSolicitante?: Usuario;
    items?: SolcomItem[];
}

export type OfertaItem = {
    id?: number;
    ofertaId?: number;
    oferta?: Oferta;
    solcomItemId?: number;
    solcomItem?: SolcomItem;
    inventarioId: number;
    inventario?: Inventario;
    inventarioConversionId?: number;
    inventarioConversion?: InventarioConversion;
    cantidad?: string;
    precio?: string;
    alicuota?: string;
    descripcion?: string;
}

export type Oferta = {
    id?: number;
    proveedorId?: number;
    proveedor?: Proveedor;
    metodoPagoId?: number;
    metodoPago?: MetodoPago;
    plazoPagoId?: number;
    plazoPago?: PlazoPago;
    fechaDisponibilidad?: string;
    observaciones?: string;
    anotacionesInternas?: string;
    estadoId?: number;
    estado?: EstadoCompras;
    validez?: string;
    bonificacion?: string;
    moneda?: string;
    color?: string;
    favorito?: boolean;
    controlArticulosExtra?: boolean;
    controlCantidades?: boolean;
    controlMetodoPLazoPago?: boolean;
    controlMonto?: boolean;
    archivoOferta?: Archivo;
    items?: OfertaItem[];
    ordenCompra?: OrdenCompra;
    aprobaciones?: OfertaAprobacion[];
    montoTotal?: number;
    createdBy?: number;
    createdByUser?: Usuario;
}

export type OrdenCompraItem = {
    id?: number;
    ordenCompraId?: number;
    inventarioId: number;
    inventario?: Inventario;
    inventarioConversionId?: number;
    inventarioConversion?: InventarioConversion;
    cantidad?: string;
    precio?: string;
    alicuota?: string;
    recepcionado?: boolean;
    cantidadRecepcionada?: string;
    descripcion?: string;
}

export type OrdenCompra = {
    id?: number;
    ofertaId?: number;
    oferta?: Oferta;
    metodoPagoId?: number;
    metodoPago?: MetodoPago; // Alias para compatibilidad
    plazoPagoId?: number;
    plazoPago?: PlazoPago; // Alias para compatibilidad
    estadoId?: number;
    estado?: EstadoCompras;
    fechaEmision?: string;
    obs?: string;
    bonificacion?: string;
    moneda?: string;
    items?: OrdenCompraItem[];
}

export type CashflowAgrupacion = {
    id: number;
    nombre: string;
    tipo: 'ingreso' | 'egreso';
    orden: number;
    descripcion?: string;
}

export type CashflowRubro = {
    id: number;
    nombre: string;
    descripcion?: string;
    agrupacionId?: number;
    agrupacion?: CashflowAgrupacion;
}

export type CashflowCategoria = {
    id: number;
    nombre: string;
    tipo: 'ingreso' | 'egreso';
    protegida: boolean;
    metodoPagoId?: number;
    metodoPago?: MetodoPago;
    rubroId?: number;
    rubro?: CashflowRubro;
}

export type CashflowTransaccion = {
    id?: number;
    categoriaId: number;
    fecha: string;
    monto: string;
    descripcion?: string;
    modelo?: string;
    modeloId?: number;
    proyectado?: boolean;
    bancoId?: number;
    conciliado?: boolean;
    categoria?: CashflowCategoria;
    banco?: Banco;
}

export type CashflowSimulacion = {
    id?: number;
    nombre: string;
    descripcion?: string;
    tipo: 'desde_cero' | 'desde_actual';
    createdAt?: string;
}

export type CashflowSimulacionTransaccion = {
    id?: number;
    simulacionId: number;
    categoriaId: number;
    fecha: string;
    monto: string;
    descripcion?: string;
    bancoId?: number;
    conciliado?: boolean;
    categoria?: CashflowCategoria;
    banco?: Banco;
}

export type MovimientoInventario = {
    id?: number;
    tipoMovimiento: string;
    motivo?: string;
    cantidad: number;
    cantidadAntes: number;
    cantidadDespues?: number;
    fecha?: Date;
    observaciones?: string;
    producto?: Inventario;
    productoId: number;
    presupuestoId?: number
    presupuesto?: Presupuesto
    trabajoId?: number
    trabajo?: ProduccionTrabajo
    reservaId?: number
    reserva?: Reserva
    inventarioConversion?: InventarioConversion
    inventarioConversionId?: number
    centroCostoId?: number
    centroCosto?: CentroCosto
    ordenCompraItemId?: number
    ordenCompraItem?: OrdenCompraItem
    personaId?: number
    persona?: Persona
}
export type InventarioReserva = {
    id: number;
    tipoMovimiento: string;
    cantidad: number;
    fecha: Date;
    observaciones: string;
    producto: Inventario;
    productoId: number;
    presupuestoId?: number
    presupuesto?: Presupuesto
    estado: 'usada' | 'disponible'
    centroCostoId?: number
    centroCosto?: CentroCosto
    trabajoId?: number
    trabajo?: ProduccionTrabajo
    reservaId?: number
    reserva?: Reserva
}

export type Reserva = {
    id: number;
    fecha: Date;
    observaciones?: string;
    presupuestoId?: number;
    presupuesto?: Presupuesto;
    trabajoId?: number;
    trabajo?: ProduccionTrabajo;
    centroCostoId?: number;
    centroCosto?: CentroCosto;
    personaId?: number;
    persona?: Persona;
    items?: ReservaItem[];
    createdAt?: Date;
    createdBy?: number;
    createdByUser?: Usuario;
}

export type ReservaItem = {
    id?: number;
    reservaId?: number;
    productoId: number;
    producto?: Inventario;
    cantidad: number;
    observaciones?: string;
    inventarioReservaId?: number;
    inventarioReserva?: InventarioReserva;
    cantidadUsada?: number;
}

export type ValidacionStock = {
    productoId: number;
    nombre: string;
    sku?: string;
    unidadMedida?: string;
    cantidadSolicitada: number;
    stockActual: number;
    stockReservado: number;
    stockDisponible: number;
    disponible: boolean;
}

export type InventarioSubcategoria = {
    id?: number;
    nombre?: string;
    inventarioCategoria?: InventarioCategoria;
    inventarioCategoriaId: number;
}

export type InventarioCategoria = {
    id?: number;
    nombre?: string;
    inventarioFamilia?: Categoria;
    inventarioFamiliaId: number;
    subcategorias?: InventarioSubcategoria[];
}

export type InventarioConversion = {
    id: number;
    cantidad: string;
    unidadOrigen: string;
    unidadDestino: string;
    descripcion?: string;
    inventario: Inventario
    inventarioId?: number

}
export type ContratoMarco = {
    id: number;
    cliente: Cliente
    clienteId?: number;
    fechaInicio: Date;
    fechaFin: Date
    nroContrato: string
    observaciones: string
    periodicidadActualizacion: string
    termDePago: string
    monto: string
    talonarios?: ContratoMarcoTalonario[];
}
export type ContratoMarcoTalonario = {
    id: number;
    fechaInicio: Date;
    fechaFin: Date
    contratoMarco: ContratoMarco;
    contratoMarcoId: number;
    items: ContratoMarcoTalonarioItem[];
}
export type ContratoMarcoTalonarioItem = {
    id: number;
    contratoMarcoTalonario: ContratoMarcoTalonario;
    contratoMarcoTalonarioId: number;
    precio: string;
    codigo: string;
    descripcion: string;
    unidadMedida: string;
    recetaId: number;
    receta: Receta;
}
export type ContratoMarcoPresupuesto = {
    id: number;
    contratoMarco: ContratoMarco
    contratoMarcoId: number
    estado: string
    tipo: string
    presupuesto: Presupuesto
    presupuestoId: number
    servicios: number[]
    items: ContratoMarcoPresupuestoItem[]

}
export type ContratoMarcoPresupuestoItem = {
    id: number;
    contratoMarcoPresupuesto: ContratoMarcoPresupuesto
    contratoMarcoPresupuestoId: number
    contratoMarcoTalonarioItem: ContratoMarcoTalonarioItem
    contratoMarcoTalonarioItemId: number
    cantidad: string
    alto: string
    ancho: string
    presupuestoItemId: number;
    presupuestoItem: PresupuestoItem
}
export type Proveedor = {
    id: number;
    codigo: string;
    cuit: string;
    razonSocial: string;
    nombreFantasia?: string;
    domicilio: string;
    localidad: string;
    telefonoContacto1: string;
    telefonoContacto2: string;
    email: string;
    numeroIngresosBrutos: string;
    notas: string;
    condicionFrenteIva: string;
    proveedorRubroId: number;
    proveedorRubro: ProveedorRubro;
    web?: string;
    contactoCobranzasNombre?: string;
    contactoCobranzasEmail?: string;
    contactoCobranzasTelefono?: string;
    legajo?: Archivo;
}

export type Banco = {
    id?: number;
    nombre: string;
    saldos?: BancoSaldo[];
    alias?: string;
    nroCuenta?: string;
    cbu?: string;
    logo?: Archivo;
    incluirEnTotal?: boolean;
    tna?: string;
}

export type BancoSaldo = {
    id?: number;
    monto: number;
    fecha: string;
    bancoId: number;
    banco?: Banco;
    descubiertoMonto?: number;
    descubiertoUso?: number;
}


export type ProductoEgreso = {
    reservaId: number | null;
    productoId: number;
    cantidad: number;
    cantidadReservada: number;
}

export type EgresoMasivo = {
    tipo: 'presupuesto' | 'centro-costo' | 'reserva';
    presupuestoId?: number;
    centroCostoId?: number;
    reservaId?: number;
    personaId?: number;
    productos: ProductoEgreso[];
    motivo?: string;
    observaciones?: string;
}

export type ResultadoEgreso = {
    productoId: number;
    productoNombre: string;
    cantidadConsumida: number;
    tipo: string;
    cantidadReserva?: number;
    cantidadStockAdicional?: number;
}

export interface Permission {
    id: number;
    codigo: string;
    descripcion?: string;
    modulo?: string;
}

export interface Role {
    id: number;
    nombre: string;
    descripcion?: string;
    parentId?: number;
    nivel?: number;
    color?: string;
    icono?: string;
    parent?: Role;
    children?: Role[];
    rolePermissions?: RolePermission[];
}

export interface RolePermission {
    id: number;
    roleId: number;
    permissionId: number;
    role?: Role;
    permission?: Permission;
}

export interface CreatePermissionDto {
    codigo: string;
    descripcion?: string;
    modulo?: string;
}

export interface UpdatePermissionDto {
    codigo?: string;
    descripcion?: string;
    modulo?: string;
}

export interface CreateRolePermissionDto {
    roleId: number;
    permissionId: number;
}

export interface SetRolePermissionsDto {
    roleId: number;
    permissionIds: number[];
}

export interface RoleProcesoGeneral {
    id: number;
    roleId: number;
    procesoGeneralId: number;
    role?: Role;
    procesoGeneral?: ProcesoGeneral;
}

export interface CreateRoleProcesoGeneralDto {
    roleId: number;
    procesoGeneralId: number;
}

export interface UpdateRoleProcesoGeneralDto {
    roleId?: number;
    procesoGeneralId?: number;
}

export type ContactoTipo = {
    id?: number;
    nombre: string;
    icono?: string;
    color?: string;
    createdAt?: string;
    createdBy?: number;
    updatedAt?: string;
    updatedBy?: number;
    deletedAt?: string;
    deletedBy?: number;
}

export type ContactoCaso = {
    id?: number;
    titulo: string;
    clienteId?: number;
    cliente?: Cliente;
    nombreContacto?: string;
    emailContacto?: string;
    telefonoContacto?: string;
    vendedorId: number;
    vendedor?: Usuario;
    notas?: string;
    contactosProximos?: ContactoProximo[];
    createdAt?: string;
    createdBy?: number;
    updatedAt?: string;
    updatedBy?: number;
    deletedAt?: string;
    deletedBy?: number;
}

export type Contacto = {
    id?: number;
    casoId: number;
    caso?: ContactoCaso;
    tipoId: number;
    tipo?: ContactoTipo;
    descripcion?: string;
    resultado?: string;
    fecha?: string;
    vendedorId: number;
    vendedor?: Usuario;
    createdAt?: string;
    createdBy?: number;
    updatedAt?: string;
    updatedBy?: number;
    deletedAt?: string;
    deletedBy?: number;
}

export type ContactoProximo = {
    id?: number;
    casoId: number;
    caso?: ContactoCaso;
    vendedorId: number;
    vendedor?: Usuario;
    fecha?: string;
    tipoId: number;
    tipo?: ContactoTipo;
    nota?: string;
    createdAt?: string;
    createdBy?: number;
    updatedAt?: string;
    updatedBy?: number;
    deletedAt?: string;
    deletedBy?: number;
}

export type Config = {
    id: number;
    clave: string;
    valor: string | null;
    modulo: string | null;
    descripcion: string | null;
    tipo: 'string' | 'number' | 'boolean' | 'json';
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}

export type FlotaTipo = 'pickup' | 'camion' | 'auto';

export type Flota = {
    id?: number;
    recursoId?: number;
    recurso?: AlquilerRecurso;
    tipo: FlotaTipo;
    marca?: string;
    modelo?: string;
    anio?: string;
    patente?: string;
    vin?: string;
    kilometraje?: string;
    capacidadKg?: string;
    cantidadEjes?: string;
    cantidadAuxilio?: string;
    descripcion?: string;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string | null;
}

export type FlotaAsignacion = {
    flotaId: number;
    personaResponsableId?: number;
}

export type JornadaFlotaAsignacion = {
    id?: number;
    jornadaId?: number;
    flotaId?: number;
    flota?: Flota;
    jornada?: Jornada;
    personaResponsableId?: number;
    personaResponsable?: Persona;
}

export type EquipamientoTipo = 'computadoras' | 'herramientas' | 'maquinarias' | 'instalaciones' | 'mobiliarios' | 'insumos_informaticos';

export type Equipamiento = {
    id?: number;
    recursoId?: number;
    recurso?: AlquilerRecurso;
    nombre: string;
    modelo?: string;
    numeroSerie?: string;
    tipo: EquipamientoTipo;
    descripcion?: string;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string | null;
}

export type EquipamientoAsignacion = {
    equipamientoId: number;
    personaResponsableId?: number;
}

export type Ubicacion = {
    id?: number;
    recursoId?: number;
    recurso?: AlquilerRecurso;
    nombre: string;
    descripcion?: string;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string | null;
}

export type JornadaEquipamiento = {
    id?: number;
    jornadaId?: number;
    equipamientoId?: number;
    equipamiento?: Equipamiento;
    jornada?: Jornada;
    personaResponsableId?: number;
    personaResponsable?: Persona;
}