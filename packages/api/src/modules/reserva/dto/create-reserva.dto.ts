export class CreateReservaItemDto {
    productoId: number;
    cantidad: number;
    observaciones?: string;
}

export class CreateReservaDto {
    observaciones?: string;
    presupuestoId?: number;
    trabajoId?: number;
    centroCostoId?: number;
    personaId?: number;
    items: CreateReservaItemDto[];
}
