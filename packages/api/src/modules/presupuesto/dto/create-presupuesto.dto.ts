import { PresupuestoItem } from "@/modules/presupuesto-item/entities/presupuesto-item.entity"

export class CreatePresupuestoDto {
    id?: number
    tipo?: string
    disenoSolicitar: boolean
    items: any[]
    procesoGeneralId?: number
    procesoGeneral?: any
    clienteId?: number | null
    comprador?: string | null
    areaId?: number | null
    fechaEntregaEstimada: Date
    fechaFabricacionEstimada: Date
    vendedorId: number
    ventaTotal: number
    ignorarStock?: boolean
    contactoCasoId?: number
    alquilerRecursoId?: number | null
}

