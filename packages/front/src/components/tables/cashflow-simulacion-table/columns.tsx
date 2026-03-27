"use client";
import { ColumnDef } from "@tanstack/react-table";
import { CashflowSimulacion } from "@/types";
import { CellColumn } from "@/components/ui/cell-column";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { hasPermission } from "@/hooks/use-access";
import { PERMISOS } from "@/constants/permisos";
import { useRemoveSimulacion } from "@/hooks/cashflow-simulacion";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface DataTableRowActionsProps {
  data: CashflowSimulacion;
  onEdit: (simulacion: CashflowSimulacion) => void;
}

const DataTableRowActions = ({ data, onEdit }: DataTableRowActionsProps) => {
  const { toast } = useToast();
  const router = useRouter();
  const { mutateAsync: removeSimulacion } = useRemoveSimulacion();
  const canEdit = hasPermission(PERMISOS.CASHFLOW_SIMULACION_EDITAR);
  const canDelete = hasPermission(PERMISOS.CASHFLOW_SIMULACION_ELIMINAR);

  const handleDelete = async () => {
    if (!confirm(`¿Eliminar la simulación "${data.nombre}"? Esta acción eliminará todas sus transacciones.`)) return;
    try {
      await removeSimulacion(data.id!);
      toast({ description: "Simulación eliminada" });
    } catch {
      toast({ description: "Error al eliminar la simulación", variant: "destructive" });
    }
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Abrir menú</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => router.push(`/cashflow/${data.id}/simu`)}>
          Abrir simulación
        </DropdownMenuItem>
        {canEdit && (
          <DropdownMenuItem onClick={() => onEdit(data)}>
            Editar
          </DropdownMenuItem>
        )}
        {canDelete && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={handleDelete}>
              Eliminar
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const getColumns = (
  onEdit: (simulacion: CashflowSimulacion) => void
): ColumnDef<CashflowSimulacion>[] => [
  {
    accessorFn: (row) => row.nombre,
    id: "nombre",
    accessorKey: "nombre",
    header: "Nombre",
    cell: ({ row }) => (
      <CellColumn>
        <div>
          <p className="font-medium">{row.getValue("nombre")}</p>
          {row.original.descripcion && (
            <p className="text-sm text-muted-foreground">{row.original.descripcion}</p>
          )}
        </div>
      </CellColumn>
    ),
  },
  {
    accessorFn: (row) => row.tipo,
    id: "tipo",
    accessorKey: "tipo",
    header: "Tipo",
    cell: ({ row }) => (
      <CellColumn>
        <Badge variant={row.original.tipo === "desde_actual" ? "default" : "secondary"}>
          {row.original.tipo === "desde_actual" ? "Desde actual" : "Desde cero"}
        </Badge>
      </CellColumn>
    ),
    enableColumnFilter: false,
  },
  {
    accessorFn: (row) => row.createdAt,
    id: "createdAt",
    accessorKey: "createdAt",
    header: "Creada",
    cell: ({ row }) => (
      <CellColumn>
        {row.original.createdAt
          ? format(new Date(row.original.createdAt), "dd/MM/yyyy HH:mm", { locale: es })
          : "-"}
      </CellColumn>
    ),
    enableColumnFilter: false,
  },
  {
    id: "acciones",
    header: "Acciones",
    enableColumnFilter: false,
    cell: ({ row }) => (
      <DataTableRowActions data={row.original} onEdit={onEdit} />
    ),
  },
];
