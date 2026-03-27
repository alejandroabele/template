export class CreateRecetaDto {
    nombre: string;
    descripcion: string;
    productos: { productoId: number; cantidad: number; etapa: string; tipo: string, produccionTrabajoId: number }[];
}
