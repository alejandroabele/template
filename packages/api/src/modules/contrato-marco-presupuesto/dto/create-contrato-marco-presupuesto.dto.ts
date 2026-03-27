import { Presupuesto } from "@/modules/presupuesto/entities/presupuesto.entity";
import { ContratoMarcoPresupuestoItem } from "@/modules/contrato-marco-presupuesto-item/entities/contrato-marco-presupuesto-item.entity";

export class CreateContratoMarcoPresupuestoDto {

    servicios?: number[];
    presupuesto?: Presupuesto
    items?: ContratoMarcoPresupuestoItem[]
    estado?: string
    tipo?: string
}
