export class CreateCobroDto {
    modelo: string; // 'presupuesto' o 'alquiler'
    modeloId: number;
    monto: number;
    fecha?: string;
    inicioPeriodo?: string;
    finPeriodo?: string;
    clienteId?: number;
    facturaId?: number;
    metodoPagoId?: number;
    bancoId?: number;
    retenciones?: string;
}
