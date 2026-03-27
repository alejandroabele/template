export class CreateCuentaContableDto {
  codigo: string;
  descripcion: string;
  tipo: 'activo' | 'pasivo' | 'patrimonio' | 'ingreso' | 'gasto';
}
