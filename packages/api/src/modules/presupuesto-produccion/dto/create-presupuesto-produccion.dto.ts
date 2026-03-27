export class CreatePresupuestoProduccionDto {
    iniciado: number
    terminado: number
    presupuestoId: number
    trabajoId: number
    ignorarStock?: boolean
    fechaFabricacion: Date
}
