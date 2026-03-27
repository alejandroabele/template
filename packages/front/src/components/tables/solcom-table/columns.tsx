import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteSolcomMutation } from "@/hooks/solcom";
import { ColumnDef, Table as TableType } from "@tanstack/react-table";
import {
  MoreHorizontal,
  ChevronDown,
  ChevronRight,
  ChevronsDown,
} from "lucide-react";
import React from "react";
import { Solcom } from "@/types";
import Link from "next/link";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { cn } from "@/lib/utils";
import { EstadoSolcomSelector } from "@/components/selectors/estado-solcom-selector";
import { ESTADO_SOLCOM_CODIGOS } from "@/constants/compras";
import { CellColumn } from "@/components/ui/cell-column";
import { Badge } from "@/components/ui/badge";
import { getColorFromString } from "@/utils/color-hash";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDate } from "@/utils/date";

const baseUrl = "solcom";

const DataTableRowActions = ({ data }: { data: Solcom }) => {
  const [openDelete, setOpenDelete] = React.useState(false);
  const { mutate } = useDeleteSolcomMutation();

  const isLeido =
    "registroLeido" in data
      ? (data as { registroLeido?: boolean }).registroLeido
      : true;

  const isAprobada = data.estado?.codigo === ESTADO_SOLCOM_CODIGOS.SOLC_AP;

  return (
    <>
      <DeleteDialog
        onDelete={() => {
          mutate(data.id!);
          setOpenDelete(false);
        }}
        open={openDelete}
        onClose={() => {
          setOpenDelete(false);
        }}
      />
      <div
        className={cn(
          "h-full flex items-center",
          !isLeido && "border-l-8 border-l-gray-400"
        )}
      >
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only"> Abrir menú </span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones </DropdownMenuLabel>
            <Link className="" href={`${baseUrl}/${data.id}`}>
              <DropdownMenuItem onClick={() => console.log("Ver", data)}>
                Ver
              </DropdownMenuItem>
            </Link>
            <Link className="" href={`${baseUrl}/${data.id}`}>
              <DropdownMenuItem onClick={() => console.log("Editar", data)}>
                Editar
              </DropdownMenuItem>
            </Link>
            <Link className="" href={`${baseUrl}/${data.id}/mensajes`}>
              <DropdownMenuItem>Mensajes</DropdownMenuItem>
            </Link>
            {isAprobada ? (
              <Link className="" href={`/ofertas/crear?solcomId=${data.id}`}>
                <DropdownMenuItem>Crear Oferta</DropdownMenuItem>
              </Link>
            ) : (
              <DropdownMenuItem disabled>Crear Oferta</DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setOpenDelete(true)}>
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};

export const columns: ColumnDef<Solcom>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Seleccionar todo"
      />
    ),
    cell: ({ row }) => (
      <CellColumn>
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Seleccionar fila"
        />
      </CellColumn>
    ),
    enableSorting: false,
    enableHiding: false,
    enableColumnFilter: false,
  },
  {
    id: "expander",
    header: ({ table }) => (
      <>
        {table.getIsAllRowsExpanded() ? (
          <ChevronDown
            onClick={() =>
              table.toggleAllRowsExpanded(!table.getIsAllRowsExpanded())
            }
            className="h-4 w-4"
          />
        ) : (
          <ChevronRight
            onClick={() =>
              table.toggleAllRowsExpanded(!table.getIsAllRowsExpanded())
            }
            className="h-4 w-4"
          />
        )}
      </>
    ),
    cell: ({ row }) => {
      return row.original.items && row.original.items.length > 0 ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => row.toggleExpanded()}
          className="p-0 h-8 w-8"
        >
          {row.getIsExpanded() ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      ) : null;
    },
  },
  {
    id: "acciones",
    cell: ({ row }) => {
      return <DataTableRowActions data={row.original} />;
    },
  },
  {
    accessorKey: "id",
    header: "ID",
    enableGrouping: true,
    cell: ({ row }) => (
      <Link className="pl-4" href={`/${baseUrl}/${row.getValue("id")}`}>
        {row.getValue("id")}
      </Link>
    ),
  },
  {
    accessorKey: "estadoId",
    header: "Estado",
    cell: ({ row }) => {
      const estado = row.original.estado;
      return (
        <Link className="pl-4" href={`${baseUrl}/${row.getValue("id")}`}>
          {estado?.nombre || "N/A"}
        </Link>
      );
    },
    meta: {
      customFilter: (table: TableType<Solcom>) => {
        const estadoId = table
          .getColumn("estadoId")
          ?.getFilterValue() as string;
        return (
          <EstadoSolcomSelector
            value={estadoId}
            onChange={(value) => {
              table.getColumn("estadoId")?.setFilterValue(value);
            }}
            placeholder="Filtrar por estado"
          />
        );
      },
    },
  },
  {
    accessorKey: "presupuesto",
    header: "Presupuesto",
    cell: ({ row }) => {
      const presupuesto = row.original.presupuesto;
      return (
        <CellColumn>{presupuesto ? `#${presupuesto.id}` : "N/A"}</CellColumn>
      );
    },
  },
  {
    accessorFn: (row) => row.centro?.nombre,
    id: "centro.nombre",
    header: "Centro de Costo",
    cell: ({ row }) => {
      const centro = row.original.centro;
      return <CellColumn>{centro?.nombre || "N/A"}</CellColumn>;
    },
  },
  {
    accessorFn: (row) => row.usuarioSolicitante?.nombre,
    id: "usuarioSolicitante.nombre",
    header: "Solicitante",
    cell: ({ row }) => {
      const usuario = row.original.usuarioSolicitante;
      return <CellColumn>{usuario?.nombre || "N/A"}</CellColumn>;
    },
  },
  {
    accessorKey: "fechaCreacion",
    header: "Fecha Creación",
    meta: {
      filterVariant: "date-range",
    },
    cell: ({ row }) => (
      <CellColumn>
        {formatDate(row.getValue("fechaCreacion")) || "N/A"}
      </CellColumn>
    ),
  },
  {
    accessorKey: "fechaLimite",
    header: "Fecha Límite",
    meta: {
      filterVariant: "date-range",
    },
    cell: ({ row }) => (
      <CellColumn>
        {formatDate(row.getValue("fechaLimite")) || "N/A"}
      </CellColumn>
    ),
  },
  {
    id: "items",
    header: "Items",
    cell: ({ row }) => {
      const items = row.original.items || [];
      return <CellColumn>{items.length} item(s)</CellColumn>;
    },
  },
];
