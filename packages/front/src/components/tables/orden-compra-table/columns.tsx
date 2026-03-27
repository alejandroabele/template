import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteOrdenCompraMutation } from "@/hooks/orden-compra";
import { ColumnDef, Table as TableType } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import React from "react";
import { OrdenCompra } from "@/types";
import Link from "next/link";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { Badge } from "@/components/ui/badge";
import { EstadoOrdenCompraSelector } from "@/components/selectors/estado-orden-compra-selector";
import { CellColumn } from "@/components/ui/cell-column";

const baseUrl = "/orden-compra";

const DataTableRowActions = ({ data }: { data: OrdenCompra }) => {
  const [openDelete, setOpenDelete] = React.useState(false);
  const { mutate } = useDeleteOrdenCompraMutation();
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
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menú</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
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
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setOpenDelete(true)}>
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export const columns: ColumnDef<OrdenCompra>[] = [
  {
    accessorKey: "id",
    header: "ID",
    enableGrouping: true,
    cell: ({ row }) => (
      <Link className="pl-4" href={`${baseUrl}/${row.getValue("id")}`}>
        {row.getValue("id")}
      </Link>
    ),
  },
  {
    accessorKey: "oferta",
    header: "Oferta",
    cell: ({ row }) => {
      const oferta = row.original.oferta;
      return (
        <Link className="pl-4" href={`/ofertas/${oferta?.id}`}>
          {oferta ? `Presupuesto #${oferta.id}` : "-"}
        </Link>
      );
    },
  },
  {
    accessorKey: "estadoId",
    header: "Estado",
    cell: ({ row }) => {
      const estado = row.original.estado;
      const ofertaId = row.original.oferta?.id;
      return (
        <div className="flex items-center gap-2">
          {estado ? <Badge>{estado.nombre}</Badge> : "-"}
          {ofertaId && (
            <span className="text-xs text-muted-foreground">#{ofertaId}</span>
          )}
        </div>
      );
    },
    meta: {
      customFilter: (table: TableType<OrdenCompra>) => {
        const estadoId = table
          .getColumn("estadoId")
          ?.getFilterValue() as string;
        return (
          <EstadoOrdenCompraSelector
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
    accessorKey: "fechaEmision",
    header: "Fecha Emisión",
    meta: { filterVariant: "date-range" },
    cell: ({ row }) => (
      <Link className="pl-4" href={`${baseUrl}/${row.getValue("id")}`}>
        {row.getValue("fechaEmision") || "-"}
      </Link>
    ),
  },
  {
    accessorKey: "oferta.proveedor.razonSocial",
    id: "proveedor.razonSocial",
    header: "Proveedor",
    cell: ({ row }) => (
      <CellColumn>
        {row.original.oferta?.proveedor?.razonSocial || "-"}
      </CellColumn>
    ),
  },
  {
    id: "acciones",
    cell: ({ row }) => {
      return <DataTableRowActions data={row.original} />;
    },
  },
];
