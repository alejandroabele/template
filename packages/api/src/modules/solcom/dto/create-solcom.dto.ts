export class CreateSolcomItemDto {
    inventarioId: number;
    inventarioConversionId?: number;
    descripcion?: string;
    cantidad?: string;
    minimo?: string;
    maximo?: string;
    compradorId?: number;
}

export class CreateSolcomDto {
    presupuestoId?: number;
    centroId?: number;
    descripcion?: string;
    fechaCreacion?: string;
    fechaLimite?: string;
    estadoId?: number;
    usuarioSolicitanteId?: number;
    items?: CreateSolcomItemDto[];
}
