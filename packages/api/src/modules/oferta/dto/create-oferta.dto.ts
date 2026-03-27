export class CreateOfertaItemDto {
    solcomItemId?: number;
    inventarioId: number;
    inventarioConversionId?: number;
    cantidad?: string;
    precio?: string;
    alicuota?: string;
    descripcion?: string;
}

export class CreateOfertaDto {
    proveedorId?: number;
    metodoId?: number;
    plazoId?: number;
    fechaDisponibilidad?: string;
    observaciones?: string;
    anotacionesInternas?: string;
    estadoId?: number;
    validez?: string;
    bonificacion?: string;
    moneda?: string;
    color?: string;
    favorito?: boolean;
    controlArticulosExtra?: boolean;
    controlCantidades?: boolean;
    controlMetodoPLazoPago?: boolean;
    controlMonto?: boolean;
    items?: CreateOfertaItemDto[];
}
