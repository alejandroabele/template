export const PROYECCION_DIAS = ['15', '30', "60", "90", "180"] as const

export const DETALLE_PRESUPUESTO = {
    CONDICION_IVA: "No incluyen IVA (21%)",
    CONDICION_PAGO: "30 días f/f",
    TIEMPO_ENTREGA: "A convenir",
    LUGAR_ENTREGA: " Retira en base Pintegralco PIN - Neuquén",
    MANT_OFERTA: "15 días",
    DESCRIPCION_GLOBAL: "De nuestra mayor consideración, el motivo del presente es presupuestar los trabajos que se detallan a continuación:",
    MONEDA: "$"
}

export const PRESUPUESTO_DISEÑO_ESTADO = {
    pendiente: 'Pendiente',
    completo: 'Completo',
};

export const ESTATUS = {
    completo: 'completo',
    parcial: 'parcial',
    pendiente: 'pendiente'
}

export const TIPO_PRESUPUESTO = {
    MANTENIMIENTO: 'MANTENIMIENTO',
} as const

export const PROCESO_GENERAL = {
    OPORTUNIDAD: 1,
    PRIMER_CONTACTO: 2,
    VISITA: 3,
    RELEVAMIENTO: 4,
    ANALISIS: 5,
    COSTEO_TECNICO: 6,
    COSTEO_COMERCIAL: 7,
    PROPUESTA_PREPARADA: 8,
    PROPUESTA_PRESENTADA: 9,
    NEGOCIACION: 10,
    PERDIDA_SUSPENDIDA: 11,
    PROPUESTA_GANADA: 12,
    ENVIADO_A_PRODUCCION: 13,
    EN_PRODUCCION: 14,
    TRABAJO_TERMINADO: 15,
    FACTURADO: 16,
    ENVIADO_A_SERVICIO: 17,
    EN_SERVICIO: 18,
    ENTREGADO: 19,
    FACTURACION_HABILITADA: 20,
    COBRADO: 21,
    CERTIFICACION_PENDIENTE: 22,
    ENVIADO_A_ALMACEN: 23,
    PENDIENTE_DE_COMPRAS: 24,
    EN_MANTENIMIENTO: 25,
}

export const AREAS = {
    MANTENIMIENTO_DE_TRAILER: 14,
    MANTENIMIENTO_DE_CARTELES: 18
}

export const PRESUPUESTO_ITEM_TIPO = {
    SERVICIO: { valor: 'SERVICIO', label: 'SERVICIO', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    PRODUCCION: { valor: 'PRODUCCION', label: 'PRODUCCIÓN', color: 'bg-red-100 text-red-800 border-red-200' },
    MANTENIMIENTO: { valor: 'MANTENIMIENTO', label: 'MANTENIMIENTO', color: 'bg-green-100 text-green-800 border-green-200' },
} as const