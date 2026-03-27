export class ProductoEgresoDto {
    reservaId: number | null;
    productoId: number;
    cantidad: number;
    cantidadReservada: number;
}

export class EgresoMasivoDto {
    // Permitir tipos flexibles o nulos, aunque idealmente deberíamos tipar fuerte.
    // Se relaja para permitir 'reserva' u otros futuros.
    tipo: string;

    presupuestoId?: number;
    centroCostoId?: number;
    // Agregamos reservaId top-level opcional como solicitó el usuario
    reservaId?: number;
    // Persona asociada a la reserva (si existe)
    personaId?: number;

    productos: ProductoEgresoDto[];
    motivo?: string;
    observaciones?: string;
}
