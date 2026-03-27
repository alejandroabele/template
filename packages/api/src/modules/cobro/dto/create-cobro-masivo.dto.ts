export class CreateCobroMasivoItemDto {
    facturaId: number;
    monto: number;
}

export class CreateCobroMasivoDto {
    fecha: string;
    metodoPagoId?: number;
    bancoId?: number;
    retenciones?: string;
    facturas: CreateCobroMasivoItemDto[];
}
