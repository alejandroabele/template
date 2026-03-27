import { Inventario } from "@/modules/inventario/entities/inventario.entity"

export class CreateMovimientoInventarioDto {

    id?: number
    tipoMovimiento: string
    motivo: string
    cantidad: number
    cantidadAntes?: number
    cantidadDespues?: number
    producto?: Inventario
    fecha?: Date
    observaciones?: string
    productoId: number
    presupuestoId?: number
    trabajoId?: number
    origen?: string
    inventarioReservaId?: number
    inventarioConversionId?: number
    centroCostoId?: number
    ordenCompraItemId?: number
    personaId?: number
    reservaId?: number

}
