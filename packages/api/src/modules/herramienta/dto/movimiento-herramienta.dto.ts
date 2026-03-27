import { TIPO_MOVIMIENTO } from '@/constants/inventario';

export class MovimientoHerramientaDto {
    tipo: typeof TIPO_MOVIMIENTO.PRESTAMO | typeof TIPO_MOVIMIENTO.DEVOLUCION;
    personaId: number;
    cantidad: number;
    observaciones?: string;
}
