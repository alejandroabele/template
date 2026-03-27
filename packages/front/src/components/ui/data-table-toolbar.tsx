import { Table } from "@tanstack/react-table";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTableViewOptions } from "@/components/ui/data-table-view-options";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  download?: React.ReactNode;
  create: boolean;
  deleteFilters: boolean;
  onDelete?: () => void;
  customActions?: React.ReactNode; // Prop opcional
}

export function DataTableToolbar<TData>({
  table,
  download,
  create,
  deleteFilters,
  onDelete,
  customActions,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const pathname = usePathname();

  // Obtener las filas seleccionadas
  const selectedRows = table.getSelectedRowModel().rows;

  // Solo mostrar el botón de eliminar si hay más de una fila seleccionada
  const showDeleteButton = selectedRows.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {/* Aquí iría el campo de búsqueda si se desea */}
      </div>
      <div className="flex gap-2 p-2">
        {customActions}
        {onDelete && (
          <Button
            size="sm"
            onClick={onDelete}
            className="ml-2 h-8"
            disabled={!showDeleteButton}
          >
            Eliminar
          </Button>
        )}
        {isFiltered && deleteFilters && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            <span className="hidden md:inline">Eliminar Busqueda</span>
            <X />
          </Button>
        )}
        {download}
        {create && (
          <Link href={`${pathname}/crear`}>
            <Button size="sm" className="ml-auto h-8 lg:flex">
              Agregar
            </Button>
          </Link>
        )}
        <DataTableViewOptions table={table} />

        {/* Mostrar botón de eliminar solo si hay más de una fila seleccionada */}
      </div>
    </div>
  );
}
