import { Inventario } from "../entities/inventario.entity";

type Producto = {
    productoId: number;
    cantidad: number;
    stockReservado?: number
    producto: Inventario,
    inventarioConversionId?: number
    ordenCompraItemId?: number
}

export class CreateIngresoMercaderiaDto {

    productos: Producto[]
    ordenCompraId?: number

}
