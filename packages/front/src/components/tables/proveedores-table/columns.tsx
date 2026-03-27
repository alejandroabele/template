import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteProveedorMutation } from "@/hooks/proveedor";
import type { ColumnDef, Table as TableType } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import React from "react";
import type { Proveedor } from "@/types";
import Link from "next/link";
import { CellColumn } from "@/components/ui/cell-column";
import { SelectFilter } from "@/components/select-filter";
import { hasPermission } from "@/hooks/use-access";
import { PERMISOS } from "@/constants/permisos";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { CONDICION_IVA } from "@/constants/condicion-iva";

const baseUrl = "proveedores";

const DataTableRowActions = ({ data }: { data: Proveedor }) => {
  const [openDelete, setOpenDelete] = React.useState(false);
  const { mutate } = useDeleteProveedorMutation();

  return (
    <>
      <DeleteDialog
        onDelete={() => {
          mutate(data.id);
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
          <Link className="" href={`${baseUrl}/${data.id}/edit`}>
            <DropdownMenuItem onClick={() => console.log("Editar", data)}>
              Editar
            </DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />
          {hasPermission(PERMISOS.PROVEEDORES_ELIMINAR) && (
            <DropdownMenuItem onClick={() => setOpenDelete(true)}>
              Eliminar
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export const columns: ColumnDef<Proveedor>[] = [
  {
    id: "acciones",
    cell: ({ row }) => {
      return <DataTableRowActions data={row.original} />;
    },
  },
  {
    accessorKey: "id",
    id: "id",
    header: "ID",
    enableGrouping: true,
    cell: ({ row }) => (
      <Link className="pl-4" href={`${baseUrl}/${row.getValue("id")}`}>
        {row.getValue("id")}
      </Link>
    ),
  },
  {
    accessorKey: "cuit",
    id: "cuit",
    header: "Cuit",
    cell: ({ row }) => <CellColumn>{row.getValue("cuit")}</CellColumn>,
  },
  {
    accessorKey: "razonSocial",
    id: "razonSocial",
    header: "Razón Social",
    cell: ({ row }) => <CellColumn> {row.getValue("razonSocial")} </CellColumn>,
  },
  {
    accessorKey: "domicilio",
    id: "domicilio",
    header: "Domicilio",
    cell: ({ row }) => <CellColumn> {row.getValue("domicilio")} </CellColumn>,
  },
  {
    accessorKey: "localidad",
    id: "localidad",
    header: "Localidad",
    cell: ({ row }) => <CellColumn> {row.getValue("localidad")} </CellColumn>,
  },
  {
    accessorKey: "telefonoContacto1",
    id: "telefonoContacto1",
    header: "Teléfono de Contacto 1",
    cell: ({ row }) => (
      <CellColumn> {row.getValue("telefonoContacto1")} </CellColumn>
    ),
  },
  {
    accessorKey: "telefonoContacto2",
    id: "telefonoContacto2",
    header: "Teléfono de Contacto 2",
    cell: ({ row }) => (
      <CellColumn> {row.getValue("telefonoContacto2")} </CellColumn>
    ),
  },
  {
    accessorKey: "email",
    id: "email",
    header: "Email",
    cell: ({ row }) => <CellColumn> {row.getValue("email")} </CellColumn>,
  },
  {
    accessorKey: "numeroIngresosBrutos",
    id: "numeroIngresosBrutos",
    header: "Número Ingresos Brutos",
    cell: ({ row }) => (
      <CellColumn> {row.getValue("numeroIngresosBrutos")} </CellColumn>
    ),
  },
  {
    accessorKey: "notas",
    id: "notas",
    header: "Notas",
    cell: ({ row }) => (
      <CellColumn> {row.getValue("notas") || "–"} </CellColumn>
    ),
  },
  {
    accessorKey: "condicionFrenteIva",
    id: "condicionFrenteIva",
    header: "Condición Frente IVA",
    meta: {
      customFilter: (table: TableType<Proveedor>) => (
        <SelectFilter table={table} columnId="condicionFrenteIva" />
      ),
    },
    cell: ({ row }) => {
      const condicion = CONDICION_IVA[row.getValue("condicionFrenteIva")];
      return <CellColumn>{condicion}</CellColumn>;
    },
  },
  {
    accessorFn: (row) => row.proveedorRubro?.nombre,
    id: "proveedorRubro.nombre",
    header: "Rubro Proveedor",
    cell: ({ row }) => (
      <CellColumn> {row.original.proveedorRubro?.nombre} </CellColumn>
    ),
  },
  {
    accessorKey: "web",
    id: "web",
    header: "Página Web",
    cell: ({ row }) => {
      const web = row.getValue("web") as string;
      return web ? (
        <CellColumn>
          <a
            href={web}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {web}
          </a>
        </CellColumn>
      ) : (
        <CellColumn>–</CellColumn>
      );
    },
  },
  {
    accessorKey: "contactoCobranzasNombre",
    id: "contactoCobranzasNombre",
    header: "Contacto Cobranzas",
    cell: ({ row }) => (
      <CellColumn>
        {" "}
        {row.getValue("contactoCobranzasNombre") || "–"}{" "}
      </CellColumn>
    ),
  },
  {
    accessorKey: "contactoCobranzasEmail",
    id: "contactoCobranzasEmail",
    header: "Email Cobranzas",
    cell: ({ row }) => {
      const email = row.getValue("contactoCobranzasEmail") as string;
      return email ? (
        <CellColumn>
          <a href={`mailto:${email}`} className="text-blue-600 hover:underline">
            {email}
          </a>
        </CellColumn>
      ) : (
        <CellColumn>–</CellColumn>
      );
    },
  },
  {
    accessorKey: "contactoCobranzasTelefono",
    id: "contactoCobranzasTelefono",
    header: "Teléfono Cobranzas",
    cell: ({ row }) => (
      <CellColumn>
        {" "}
        {row.getValue("contactoCobranzasTelefono") || "–"}{" "}
      </CellColumn>
    ),
  },
];
