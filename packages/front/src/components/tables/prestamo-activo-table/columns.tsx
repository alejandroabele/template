"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { CellColumn } from "@/components/ui/cell-column";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import { HerramientasDevolverDialog } from "@/components/dialogs/herramienta-devolucion-dialog";
import { Undo2 } from "lucide-react";

const AccionesPrestamoActivo = ({ data }: { data: any }) => {
  const [open, setOpen] = React.useState(false);
  const personaNombre = data.persona
    ? `${data.persona.nombre} ${data.persona.apellido}`
    : "";

  return (
    <>
      {open && <HerramientasDevolverDialog
        herramienta={data.herramienta}
        open={open}
        onClose={() => setOpen(false)}
        prestamo={{
          personaId: data.persona?.id,
          personaNombre,
          cantidad: Number(data.cantidad),
        }}
      />}
      <Button
        size="sm"
        variant="outline"
        onClick={() => setOpen(true)}
        title="Registrar devolución"
      >
        <Undo2 className="h-4 w-4 mr-1" />
        Registrar devolución
      </Button>
    </>
  );
};

export const columns: ColumnDef<any>[] = [
  {
    id: "herramienta.nombre",
    enableColumnFilter: false,

    header: "Herramienta",
    cell: ({ row }) => (
      <Link href={`/herramientas/${row.original.herramienta?.id}`}>
        <CellColumn>{row.original.herramienta?.nombre}</CellColumn>
      </Link>
    ),
  },
  {
    id: "herramienta.sku",
    header: "SKU",
    cell: ({ row }) => <CellColumn>{row.original.herramienta?.sku}</CellColumn>,
  },
  {
    id: "persona",
    header: "Persona",
    enableColumnFilter: false,
    cell: ({ row }) => {
      const persona = row.original.persona;
      return (
        <CellColumn>
          {persona ? `${persona.nombre} ${persona.apellido}` : "-"}
        </CellColumn>
      );
    },
  },
  {
    accessorKey: "cantidad",
    enableColumnFilter: false,

    header: "Cantidad prestada",
    cell: ({ row }) => <CellColumn>{row.getValue("cantidad")}</CellColumn>,
  },
  {
    accessorKey: "fechaPrestamo",
    enableColumnFilter: false,

    header: "Fecha préstamo",
    cell: ({ row }) => {
      const fecha = row.getValue("fechaPrestamo") as string;
      return (
        <CellColumn>
          {fecha ? new Date(fecha).toLocaleDateString("es-AR") : "-"}
        </CellColumn>
      );
    },
  },
  {
    id: "acciones",
    cell: ({ row }) => <AccionesPrestamoActivo data={row.original} />,
  },
];
