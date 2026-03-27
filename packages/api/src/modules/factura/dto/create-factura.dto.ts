export class CreateFacturaDto {
    modelo: string; // 'presupuesto' o 'alquiler'
    modeloId: number;
    monto: number;
    importeBruto?: number;
    alicuota?: string;
    estado?: string; // 'pendiente', 'pagado', 'parcial'
    folio?: string;
    fecha: string;
    fechaVencimiento?: string;
    inicioPeriodo?: string;
    finPeriodo?: string;
    clienteId?: number;
}
