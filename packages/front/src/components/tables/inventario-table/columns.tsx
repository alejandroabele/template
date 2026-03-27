import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteInventarioMutation } from "@/hooks/inventario";

import { ColumnDef, Table as TableType } from "@tanstack/react-table";
import { MoreHorizontal, TriangleAlert } from "lucide-react";
import React from "react";
import { Inventario } from "@/types";
import Link from "next/link";
import { CategoriasSelector } from "@/components/selectors/categorias-selector";
import { Currency } from "@/components/ui/currency";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { CellColumn } from "@/components/ui/cell-column";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UNIDADES } from "@/constants/inventario";

const baseUrl = "productos";
const DataTableRowActions = ({ data }: { data: Inventario }) => {
  const { mutate } = useDeleteInventarioMutation();
  const [openDelete, setOpenDelete] = React.useState(false);

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
            <DropdownMenuItem onClick={() => {}}>Ver</DropdownMenuItem>
          </Link>
          <Link className="" href={`${baseUrl}/${data.id}`}>
            <DropdownMenuItem onClick={() => {}}>Editar</DropdownMenuItem>
          </Link>
          <Link className="" href={`${baseUrl}/${data.id}/duplicar`}>
            <DropdownMenuItem onClick={() => {}}>Duplicar</DropdownMenuItem>
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

interface CategoriaFilterProps<T> {
  table: TableType<T>;
}

export function CategoriaFilter<T>({ table }: CategoriaFilterProps<T>) {
  const [selectedCategoria, setSelectedCategoria] = React.useState<string>("");
  const defaultValue =
    (table
      .getState()
      .columnFilters.find((element) => element.id === "categoriaId")
      ?.value as string) || "";

  React.useEffect(() => {
    setSelectedCategoria(defaultValue);
  }, [defaultValue]);

  const handleSelectedCategoria = (value: string) => {
    setSelectedCategoria(value);

    table.setColumnFilters((prevFilters) => {
      const updatedFilters = prevFilters.filter(
        (filter) => filter.id !== "categoriaId"
      );
      if (value) {
        updatedFilters.push({ id: "categoriaId", value: value });
      }
      return updatedFilters;
    });
  };

  return (
    <div className="mt-2">
      <CategoriasSelector
        value={selectedCategoria}
        onChange={handleSelectedCategoria}
      />
    </div>
  );
}

export const columns: ColumnDef<Inventario>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          className=""
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
    accessorKey: "id",
    id: "id",
    header: "ID",
    cell: ({ row }) => (
      <Link className="pl-4" href={`${baseUrl}/${row.getValue("id")}`}>
        {" "}
        {row.getValue("id")}{" "}
      </Link>
    ),
  },
  {
    accessorKey: "sku",
    id: "sku",
    header: "SKU",
    cell: ({ row }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            onClick={() => navigator.clipboard.writeText(row.getValue("sku"))}
          >
            <CellColumn className=" cursor-pointer">
              {" "}
              {row.getValue("sku")}
            </CellColumn>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Click para copiar SKU</p>
        </TooltipContent>
      </Tooltip>
    ),
  },
  {
    accessorKey: "nombre",
    id: "nombre",
    header: "Nombre",
    cell: ({ row }) => (
      <Link href={`${baseUrl}/${row.getValue("id")}`}>
        <CellColumn>{row.getValue("nombre")}</CellColumn>
      </Link>
    ),
  },
  {
    accessorKey: "stock",
    id: "stock",
    header: "Stock",
    cell: ({ row }) => {
      const { stock, stockMinimo, stockMaximo, alerta, unidadMedida } =
        row.original;
      const stockNum = Number(stock);
      const min = Number(stockMinimo);
      const max = Number(stockMaximo);
      const alertaNum = Number(alerta);

      const porcentaje =
        max > 0 ? Math.min(100, Math.round((stockNum / max) * 100)) : 0;

      let barColor = "bg-gray-300";

      if (stockNum <= 0 || stockNum < min) {
        barColor = "bg-red-500";
      } else if (stockNum <= alertaNum) {
        barColor = "bg-amber-500";
      } else if (stockNum > max) {
        barColor = "bg-blue-500";
      } else {
        barColor = "bg-green-500";
      }

      return (
        <CellColumn>
          <div className="flex flex-col gap-1 w-full min-w-[120px]">
            <div className="flex justify-between text-xs font-medium">
              <span>
                {stockNum} {unidadMedida}
              </span>
              <span className="text-muted-foreground">{porcentaje}%</span>
            </div>
            <div className="h-2 w-full rounded bg-muted">
              <div
                className={`h-2 rounded transition-all duration-300 ${barColor}`}
                style={{ width: `${porcentaje}%` }}
              />
            </div>
            <div className="text-[10px] text-muted-foreground">
              Mín: {min} | Máx: {max}
            </div>
          </div>
        </CellColumn>
      );
    },
  },
  {
    accessorKey: "stockReservado",
    header: "Reservado",
    enableColumnFilter: false,
    enableSorting: false,
    id: "stockReservado",
    cell: ({ row }) => {
      const stockReservado = row.getValue("stockReservado");
      const unidadMedida = row.original.unidadMedida;

      return (
        <CellColumn>
          <div className="flex justify-center items-center gap-1">
            <div className="text-2xl font-bold text-blue-600">
              {Number(stockReservado) > 0 ? Number(stockReservado) : "-"}
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">
              {stockReservado ? unidadMedida : ""}
            </div>
          </div>
        </CellColumn>
      );
    },
  },

  {
    accessorKey: "descripcion",
    id: "descripcion",
    header: "Descripcion",
    cell: ({ row }) => <CellColumn>{row.getValue("descripcion")}</CellColumn>,
  },
  {
    id: "categoria.nombre",
    accessorKey: "categoria",
    header: "Familia",
    cell: ({ row }) => (
      <Link className="pl-4" href={`${baseUrl}/${row.getValue("id")}`}>
        {" "}
        {row.getValue("categoria.nombre")}{" "}
      </Link>
    ),
    meta: {
      customFilter: (table: TableType<Inventario>) => (
        <CategoriaFilter table={table} />
      ),
    },
  },
  {
    id: "inventarioCategoria.nombre",
    accessorKey: "inventarioCategoria",
    header: "Categoria",
    cell: ({ row }) => (
      <Link className="pl-4" href={`${baseUrl}/${row.getValue("id")}`}>
        {row.original.inventarioCategoria?.nombre}
      </Link>
    ),
    // meta: {
    //   customFilter: (table: TableType<Inventario>) => (
    //     <CategoriaFilter table={table} />
    //   ),
    // },
  },
  {
    id: "inventarioSubcategoria.nombre",
    accessorKey: "inventarioSubcategoria",
    header: "Subcategoria",
    cell: ({ row }) => (
      <Link className="pl-4" href={`${baseUrl}/${row.getValue("id")}`}>
        {row.original.inventarioSubcategoria?.nombre}
      </Link>
    ),
    // meta: {
    //   customFilter: (table: TableType<Inventario>) => (
    //     <CategoriaFilter table={table} />
    //   ),
    // },
  },
  {
    accessorKey: "punit",
    id: "punit",
    header: "Precio unitario",
    cell: ({ row }) => (
      <Link className="pl-4" href={`${baseUrl}/${row.getValue("id")}`}>
        {" "}
        <Currency>{row.getValue("punit")}</Currency>{" "}
      </Link>
    ),
    meta: {
      filterVariant: "range",
    },
  },
  // {
  //     accessorKey: "stock",
  //     header: "Stock",
  //     cell: ({ row }) => {
  //         const isStockAlertActive = row.original.manejaStock && Number(row.original.stock) <= Number(row.original.alerta)
  //         return <div className="flex items-center gap-4" > <div className="w-[50px]">{row.getValue("stock")}</div> {isStockAlertActive && (<TriangleAlert color="red" />)} </div>
  //     },

  // },

  {
    accessorKey: "unidadMedida",
    header: "Unidad",
    id: "unidadMedida",
    cell: ({ row }) => {
      const unidad = row.getValue("unidadMedida") as string;
      const unidadCompleta = UNIDADES[unidad] || unidad;

      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="cursor-pointer">
              <CellColumn>{unidad}</CellColumn>
            </div>
          </TooltipTrigger>
          <TooltipContent side="right" className="max-w-xs">
            <div className="space-y-2">
              <div className="border-t pt-2">
                <p className="text-sm font-medium mb-2">
                  Unidades disponibles:
                </p>
                <div className="grid grid-cols-1 gap-1 text-sm">
                  {Object.entries(UNIDADES).map(([codigo, descripcion]) => (
                    <div
                      key={codigo}
                      className={`flex justify-between text-muted-foreground ${codigo === unidad ? "font-bold text-primary" : ""}`}
                    >
                      <span>{codigo}</span>
                      <span className=" ml-2">{descripcion}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      );
    },
  },
  // {
  //     accessorKey: "stockMaximo",
  //     header: "Stock Maximo",
  //     cell: ({ row }) => <CellColumn> {row.getValue("stockMaximo")} </CellColumn>,
  // },
  {
    accessorKey: "estado",
    header: "Estado",
    id: "estado",
    enableColumnFilter: false,
    enableSorting: false,
    cell: ({ row }) => {
      const { stock, stockMinimo, stockMaximo, alerta, manejaStock } =
        row.original;
      const stockNum = Number(stock);
      const minimoNum = Number(stockMinimo);
      const maximoNum = Number(stockMaximo);
      const alertaNum = Number(alerta);

      const baseClass =
        "px-2 py-1 rounded text-sm font-medium whitespace-nowrap text-center";

      if (!manejaStock) {
        return (
          <div className={`${baseClass} bg-gray-100 text-gray-800`}>
            Sin control
          </div>
        );
      }

      if (stockNum <= 0 || stockNum < minimoNum) {
        return (
          <div className={`${baseClass} bg-red-100 text-red-800`}>
            Sin stock
          </div>
        );
      }

      if (stockNum <= alertaNum) {
        return (
          <div className={`${baseClass} bg-amber-100 text-amber-800`}>
            Reposición
          </div>
        );
      }

      if (stockNum > maximoNum) {
        return (
          <div className={`${baseClass} bg-blue-100 text-blue-800`}>
            Sobrestockeado
          </div>
        );
      }

      return (
        <div className={`${baseClass} bg-green-100 text-green-800`}>
          En stock
        </div>
      );
    },
  },

  {
    id: "acciones",
    cell: ({ row }) => {
      return <DataTableRowActions data={row.original} />;
    },
  },
];
