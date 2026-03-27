import React from "react";
import { Button } from "@/components/ui/button";
import { Table } from "@tanstack/react-table";

interface DataTablePaginationProps<T> {
  table: Table<T>; // La instancia de la tabla tipada
  hidePageSizeSelector?: boolean; // Prop para ocultar el selector de pageSize
}

export function DataTablePagination<T>({
  table,
  hidePageSizeSelector = false,
}: DataTablePaginationProps<T>) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-2">
      {/* Información sobre filas seleccionadas */}
      <div className="text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} de{" "}
        {table.getFilteredRowModel().rows.length} fila(s) seleccionada(s).
      </div>

      {/* Controles de paginación */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Botones de paginación */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            type="button"
            onClick={() => table.previousPage()}
            // disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            type="button"
            // disabled={!table.getCanNextPage()}
          >
            Siguiente
          </Button>
        </div>

        {/* Selector de tamaño de página */}
        {!hidePageSizeSelector && (
          <select
            className="border rounded p-1 text-sm"
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
          >
            {[5, 10, 20, 30, 40, 50, 100, 500].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Mostrar {pageSize}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}
