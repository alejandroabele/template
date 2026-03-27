export class CreateCashflowAgrupacionDto {
  nombre: string;
  tipo: 'ingreso' | 'egreso';
  orden: number;
  descripcion?: string;
}
