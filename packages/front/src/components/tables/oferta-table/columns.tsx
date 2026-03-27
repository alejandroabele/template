import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteOfertaMutation } from "@/hooks/oferta";
import { ColumnDef, Table as TableType } from "@tanstack/react-table";
import { MoreHorizontal, FileText, Star } from "lucide-react";
import { CellColumn } from "@/components/ui/cell-column";
import React from "react";
import { Oferta } from "@/types";
import Link from "next/link";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { Badge } from "@/components/ui/badge";
import { ConfirmarOrdenCompraDialog } from "@/components/dialogs/confirmar-orden-compra-dialog";
import { useRouter } from "next/navigation";
import { EstadoOfertaSelector } from "@/components/selectors/estado-oferta-selector";
import { formatMoney } from "@/utils/number";
import { Checkbox } from "@/components/ui/checkbox";
import { SelectFilter } from "@/components/select-filter";

const baseUrl = "/ofertas";

const DataTableRowActions = ({ data }: { data: Oferta }) => {
  const [openDelete, setOpenDelete] = React.useState(false);
  const [openConfirmarOrden, setOpenConfirmarOrden] = React.useState(false);
  const { mutate } = useDeleteOfertaMutation();
  const router = useRouter();

  const handleClickOrdenCompra = () => {
    if (data.ordenCompra) {
      // Si ya tiene orden de compra, navegar a ella
      router.push(`/orden-compra/${data.ordenCompra.id}`);
    } else {
      // Si no tiene, abrir el modal de confirmación
      setOpenConfirmarOrden(true);
    }
  };

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
      {openConfirmarOrden && (
        <ConfirmarOrdenCompraDialog
          open={openConfirmarOrden}
          setOpen={setOpenConfirmarOrden}
          oferta={data}
        />
      )}

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
          <Link className="" href={`${baseUrl}/${data.id}/duplicar`}>
            <DropdownMenuItem onClick={() => {}}>Duplicar</DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleClickOrdenCompra}>
            <FileText className="mr-2 h-4 w-4" />
            {data.ordenCompra
              ? `Ver OC #${data.ordenCompra.id}`
              : "Crear Orden de Compra"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setOpenDelete(true)}>
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export const columns: ColumnDef<Oferta>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions data={row.original} />,
  },
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      const color = row.original.color;
      const favorito = row.original.favorito;
      return (
        <Link
          className="pl-4 flex items-center gap-2 hover:underline"
          href={`${baseUrl}/${row.getValue("id")}`}
        >
          <span>#{row.getValue("id")}</span>
          {favorito && (
            <span title="Oferta favorita">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            </span>
          )}
          {color && (
            <span
              className="w-2 h-2 rounded-full flex-shrink-0 ring-1 ring-gray-300"
              style={{ backgroundColor: color }}
              title={`Color: ${color}`}
            />
          )}
        </Link>
      );
    },
  },
  {
    accessorFn: (row) => {
      // Obtener IDs únicos de solcoms desde los items
      const solcomIds = new Set<number>();
      row.items?.forEach((item) => {
        if (item.solcomItem?.solcom?.id) {
          solcomIds.add(item.solcomItem.solcom.id);
        }
      });
      return Array.from(solcomIds);
    },
    id: "solcomItem.solcom.id",
    accessorKey: "solcomItem.solcom.id",
    header: "SOLCOM",

    cell: ({ row }) => {
      // Obtener IDs únicos de solcoms desde los items
      const solcomIds = new Set<number>();
      row.original.items?.forEach((item) => {
        if (item.solcomItem?.solcom?.id) {
          solcomIds.add(item.solcomItem.solcom.id);
        }
      });
      const ids = Array.from(solcomIds);

      if (ids.length === 0) {
        return <CellColumn>N/A</CellColumn>;
      }

      return (
        <CellColumn>
          <div className="flex flex-wrap gap-1">
            {ids.map((id) => (
              <Link key={id} href={`/solcom/${id}`} className="hover:underline">
                #{id}
              </Link>
            ))}
          </div>
        </CellColumn>
      );
    },
    enableColumnFilter: true,
  },
  {
    id: "solcomPresupuesto.id",
    accessorKey: "solcomPresupuesto.id",
    header: "N° Presupuesto",
    cell: ({ row }) => {
      // Obtener IDs únicos de presupuestos desde las solcoms
      const presupuestoIds = new Set<number>();
      row.original.items?.forEach((item) => {
        if (item.solcomItem?.solcom?.presupuestoId) {
          presupuestoIds.add(item.solcomItem.solcom.presupuestoId);
        }
      });
      const ids = Array.from(presupuestoIds);

      if (ids.length === 0) {
        return <CellColumn>N/A</CellColumn>;
      }

      return (
        <CellColumn>
          <div className="flex flex-wrap gap-1">
            {ids.map((id) => (
              <Link
                key={id}
                href={`/presupuestos/${id}`}
                className="hover:underline"
              >
                #{id}
              </Link>
            ))}
          </div>
        </CellColumn>
      );
    },
    enableColumnFilter: true,
  },
  {
    accessorFn: (row) => {
      // Obtener nombres únicos de centros de costo desde las solcoms
      const centroNombres = new Set<string>();
      row.items?.forEach((item) => {
        if (item.solcomItem?.solcom?.centro?.nombre) {
          centroNombres.add(item.solcomItem.solcom.centro.nombre);
        }
      });
      return Array.from(centroNombres);
    },
    id: "solcomCentro.id",
    accessorKey: "solcomCentro.id",
    header: "Centro Costo",
    meta: {
      customFilter: (table: TableType<Oferta>) => (
        <SelectFilter table={table} columnId="solcomCentro.id" />
      ),
    },
    cell: ({ row }) => {
      // Obtener nombres únicos de centros de costo desde las solcoms
      const centroNombres = new Set<string>();
      row.original.items?.forEach((item) => {
        if (item.solcomItem?.solcom?.centro?.nombre) {
          centroNombres.add(item.solcomItem.solcom.centro.nombre);
        }
      });
      const nombres = Array.from(centroNombres);

      if (nombres.length === 0) {
        return <CellColumn>N/A</CellColumn>;
      }

      return (
        <CellColumn>
          <div className="flex flex-wrap gap-1">
            {nombres.map((nombre, index) => (
              <Badge key={index} variant="outline">
                {nombre}
              </Badge>
            ))}
          </div>
        </CellColumn>
      );
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: "estadoId",
    header: "Estado",
    cell: ({ row }) => {
      const estado = row.original.estado;
      return (
        <div className="pl-4">
          {estado ? <Badge variant="outline">{estado.nombre}</Badge> : "N/A"}
        </div>
      );
    },
    meta: {
      customFilter: (table: TableType<Oferta>) => {
        const estadoId = table
          .getColumn("estadoId")
          ?.getFilterValue() as string;
        return (
          <EstadoOfertaSelector
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
    id: "aprobaciones",
    header: "Aprobaciones",
    cell: ({ row }) => {
      const aprobaciones = row.original.aprobaciones || [];

      // Contar estados
      const pendientes = aprobaciones.filter(
        (a) => a.estado === "PENDIENTE"
      ).length;
      const aprobadas = aprobaciones.filter(
        (a) => a.estado === "APROBADO"
      ).length;
      const rechazadas = aprobaciones.filter(
        (a) => a.estado === "RECHAZADO"
      ).length;

      const total = aprobaciones.length;

      if (total === 0) {
        return (
          <div className="pl-4">
            <span className="text-xs text-gray-400">Sin aprobaciones</span>
          </div>
        );
      }

      return (
        <div className="flex flex-col gap-1 pl-4">
          {/* Barra de progreso visual */}
          <div className="flex gap-0.5 h-2 w-20 rounded-full overflow-hidden bg-gray-200">
            {aprobadas > 0 && (
              <div
                className="bg-green-500 transition-all"
                style={{ width: `${(aprobadas / total) * 100}%` }}
                title={`${aprobadas} aprobadas`}
              />
            )}
            {rechazadas > 0 && (
              <div
                className="bg-red-500 transition-all"
                style={{ width: `${(rechazadas / total) * 100}%` }}
                title={`${rechazadas} rechazadas`}
              />
            )}
            {pendientes > 0 && (
              <div
                className="bg-blue-500 transition-all"
                style={{ width: `${(pendientes / total) * 100}%` }}
                title={`${pendientes} pendientes`}
              />
            )}
          </div>

          {/* Contadores con iconos */}
          {/* <div className="flex gap-2 text-xs">
            {aprobadas > 0 && (
              <span className="flex items-center gap-0.5 text-green-700 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                {aprobadas}
              </span>
            )}
            {rechazadas > 0 && (
              <span className="flex items-center gap-0.5 text-red-700 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                {rechazadas}
              </span>
            )}
            {pendientes > 0 && (
              <span className="flex items-center gap-0.5 text-blue-700 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                {pendientes}
              </span>
            )}
          </div> */}
        </div>
      );
    },
  },
  {
    id: "proveedor.razonSocial",
    accessorKey: "proveedor.razonSocial",
    header: "Proveedor",
    cell: ({ row }) => {
      const proveedor = row.original.proveedor;
      return <div className="pl-4">{proveedor?.razonSocial || "N/A"}</div>;
    },
  },
  {
    accessorKey: "montoTotal",
    header: "Monto Total",
    cell: ({ row }) => {
      const montoTotal = row.original.montoTotal;
      return <div className="pl-4">{formatMoney(montoTotal || 0)}</div>;
    },
  },
  {
    accessorKey: "createdByUser",
    id: "createdByUser.nombre",

    header: "Comprador",
    cell: ({ row }) => {
      const usuario = row.original.createdByUser;
      return <div className="pl-4">{usuario?.nombre || "N/A"}</div>;
    },
  },

  {
    accessorKey: "metodoPago",
    header: "Método Pago",
    cell: ({ row }) => {
      const metodo = row.original.metodoPago;
      return <div className="pl-4">{metodo?.nombre || "N/A"}</div>;
    },
  },
  {
    accessorKey: "plazoPago",
    header: "Plazo Pago",
    cell: ({ row }) => {
      const plazo = row.original.plazoPago;
      return <div className="pl-4">{plazo?.descripcion || "N/A"}</div>;
    },
  },
  {
    accessorKey: "fechaDisponibilidad",
    header: "Fecha Disponibilidad",
    cell: ({ row }) => {
      return (
        <div className="pl-4">
          {row.getValue("fechaDisponibilidad") || "N/A"}
        </div>
      );
    },
  },
  {
    accessorKey: "validez",
    header: "Validez",
    cell: ({ row }) => {
      return <div className="pl-4">{row.getValue("validez") || "N/A"}</div>;
    },
  },
  {
    accessorKey: "moneda",
    header: "Moneda",
    cell: ({ row }) => {
      const moneda = row.getValue("moneda") as string;
      return (
        <div className="pl-4">
          {moneda ? <Badge variant="outline">{moneda}</Badge> : "N/A"}
        </div>
      );
    },
  },
  {
    id: "items",
    header: "Items",
    cell: ({ row }) => {
      const items = row.original.items || [];
      return (
        <div className="pl-4">
          <Badge variant="secondary">{items.length} items</Badge>
        </div>
      );
    },
  },
];
