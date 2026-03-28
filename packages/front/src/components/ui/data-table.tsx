"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from "@/components/ui/table"; // Asegúrate de tener los componentes correctos
import { DataTableToolbar } from "@/components/ui/data-table-toolbar"; // Asegúrate de importar el DataTableToolbar
import { DataTablePagination } from "@/components/ui/data-table-pagination"; // Asegúrate de importar el DataTablePagination
import { flexRender } from "@tanstack/react-table"; // Asegúrate de importar flexRender de react-table
import type {
  Table as TableType,
  ColumnDef,
  Column,
} from "@tanstack/react-table"; // Importar el tipo para la tabla
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { DatePicker } from "@/components/date-picker";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useConfigStore } from "@/stores/config-store"; // Asegúrate de importar el store correctamente
import { DateRangePicker } from "../date-range-picker";
import { MultiSelect } from "@/components/ui/multi-select";

interface DataTableProps<T> {
  table: TableType<T>;
  columns: ColumnDef<T>[]; // Tipamos correctamente las columnas según el tipo de datos T
  toolbar?: boolean; // Prop opcional para mostrar u ocultar el toolbar
  download?: React.ReactNode;
  create?: boolean;
  deleteFilters?: boolean;
  onDelete?: () => void;
  customActions?: React.ReactNode; // Prop opcional
  pagination?: boolean;
  renderSubComponent?: (row: T) => React.ReactElement;
}

export function DataTable<T>({
  table,
  columns,
  toolbar,
  download,
  create = true,
  deleteFilters = true,
  onDelete,
  customActions,
  pagination = true,
  renderSubComponent,
}: DataTableProps<T>) {
  // Referencia para el contenedor de la tabla
  const tableContainerRef = React.useRef<HTMLDivElement>(null);

  // Estado para controlar la visibilidad de los botones (siempre visibles ahora)
  const { accessibilityMode } = useConfigStore(); // Obtiene el estado y la función del store

  // Función para manejar el desplazamiento horizontal
  const handleScroll = (direction: "left" | "right") => {
    if (tableContainerRef.current) {
      const scrollAmount = 500;
      tableContainerRef.current.scrollBy({
        left: direction === "right" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="w-full space-y-4">
      {!toolbar ? (
        <DataTableToolbar
          create={create}
          table={table}
          download={download}
          onDelete={onDelete}
          deleteFilters={deleteFilters}
          customActions={customActions}
        />
      ) : (
        customActions && <div className="flex justify-end">{customActions}</div>
      )}
      {/* Tabla */}
      <div className="rounded-md border">
        <div className="relative w-full overflow-auto" ref={tableContainerRef}>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="">
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="px-4 py-2 text-left text-sm font-medium border-b"
                    >
                      {header.isPlaceholder ? null : (
                        <div className="flex items-center justify-between">
                          {/* Botón para Ordenamiento */}
                          {header.column.getCanSort() ? (
                            <Button
                              variant="ghost"
                              onClick={() =>
                                header.column.toggleSorting(
                                  header.column.getIsSorted() === "asc"
                                )
                              }
                              className="flex items-center"
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                              <ArrowUpDown className="ml-2 h-4 w-4" />
                            </Button>
                          ) : (
                            <div className="inline-flex items-center justify-center rounded-md bg-transparent px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors ">
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                            </div>
                          )}
                        </div>
                      )}
                      {header.column.getCanFilter() && (
                        <>
                          {header.column.columnDef.meta?.customFilter ? (
                            header.column.columnDef.meta.customFilter(table)
                          ) : (
                            <Filter column={header.column} />
                          )}
                        </>
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <React.Fragment key={row.id}>
                    <TableRow data-state={row.getIsSelected() && "selected"}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="p-2 pl-0">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                    {row.getIsExpanded() && renderSubComponent && (
                      <TableRow className="bg-muted/50">
                        <TableCell colSpan={row.getVisibleCells().length}>
                          {renderSubComponent(row.original)}
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No hay resultados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Paginación */}
      {pagination && <DataTablePagination table={table} />}

      {/* Botones de desplazamiento fijos en la esquina inferior derecha de la pantalla */}
      {accessibilityMode && (
        <div className="fixed bottom-14 right-14 flex gap-2 z-50">
          <Button
            size="sm"
            variant="default"
            className="rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => handleScroll("left")}
            aria-label="Desplazar a la izquierda"
          >
            <ChevronLeft className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="default"
            className="rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => handleScroll("right")}
            aria-label="Desplazar a la derecha"
          >
            <ChevronRight className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  );
}

function Filter({ column }: { column: Column<any, unknown> }) {
  const columnFilterValue = column.getFilterValue();
  const { filterVariant, filterOptions } = column.columnDef.meta ?? {};

  // Parse el filterValue si es un string JSON
  const parsedFilterValue = React.useMemo(() => {
    if (typeof columnFilterValue === 'string' && columnFilterValue.startsWith('{')) {
      try {
        return JSON.parse(columnFilterValue);
      } catch {
        return columnFilterValue;
      }
    }
    if (typeof columnFilterValue === 'string' && columnFilterValue.startsWith('[')) {
      try {
        return JSON.parse(columnFilterValue);
      } catch {
        return columnFilterValue;
      }
    }
    return columnFilterValue;
  }, [columnFilterValue]);

  const handleFromChange = React.useCallback(
    (value: string | number) => {
      const currentValue = typeof parsedFilterValue === 'object' && parsedFilterValue !== null
        ? parsedFilterValue as { from: string | number; to: string | number }
        : undefined;
      const newFrom = value;
      const currentTo = currentValue?.to ?? "";
      // Solo setear si hay al menos un valor válido
      if (newFrom !== "" || currentTo !== "") {
        const filterValue = {
          from: newFrom,
          to: currentTo,
        };
        column.setFilterValue(JSON.stringify(filterValue));
      } else {
        column.setFilterValue(undefined);
      }
    },
    [column, parsedFilterValue]
  );

  const handleToChange = React.useCallback(
    (value: string | number) => {
      const currentValue = typeof parsedFilterValue === 'object' && parsedFilterValue !== null
        ? parsedFilterValue as { from: string | number; to: string | number }
        : undefined;
      const newTo = value;
      const currentFrom = currentValue?.from ?? "";

      if (currentFrom !== "" || newTo !== "") {
        const filterValue = {
          from: currentFrom,
          to: newTo,
        };
        column.setFilterValue(JSON.stringify(filterValue));
      } else {
        column.setFilterValue(undefined);
      }
    },
    [column, parsedFilterValue]
  );

  return filterVariant === "range" ? (
    <div>
      <div className="flex space-x-2">
        {/* See faceted column filters example for min max values functionality */}
        <DebouncedInput
          type="number"
          value={
            (
              parsedFilterValue as {
                from: string | number;
                to: string | number;
              }
            )?.from ?? ""
          }
          onChange={handleFromChange}
          placeholder={`Min`}
          className="w-24 border shadow rounded"
        />
        <DebouncedInput
          type="number"
          value={
            (
              parsedFilterValue as {
                from: string | number;
                to: string | number;
              }
            )?.to ?? ""
          }
          onChange={handleToChange}
          placeholder={`Max`}
          className="w-24 border shadow rounded"
        />
      </div>
      <div className="h-1" />
    </div>
  ) : filterVariant === "date" ? (
    <DatePicker
      onChange={(e) => {
        column.setFilterValue(e);
      }}
      defaultValue={columnFilterValue?.toString()}
    />
  ) : filterVariant === "date-range" ? (
    <DateRangePicker
      onChange={(range) => {
        column.setFilterValue(JSON.stringify(range));
      }}
      defaultValue={parsedFilterValue as { from: string; to: string } | null}
    />
  ) : filterVariant === "multi-select" && filterOptions ? (
    <MultiSelect
      options={filterOptions}
      onValueChange={(values) => {
        column.setFilterValue(values.length > 0 ? JSON.stringify(values) : undefined);
      }}
      defaultValue={Array.isArray(parsedFilterValue) ? parsedFilterValue : []}
      placeholder="Seleccionar..."
      maxCount={2}
      className="w-full"
    />
  ) : (
    // See faceted column filters example for datalist search suggestions
    <DebouncedInput
      className="w-36 border shadow rounded"
      onChange={(value) => column.setFilterValue(value)}
      type="text"
      value={(columnFilterValue ?? "") as string}
    />
  );
}

// A typical debounced input react component
function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 1000,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = React.useState(initialValue);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value, debounce]);

  return (
    <Input
      {...props}
      value={value}
      onChange={(e) => {
        const newValue =
          props.type === "number"
            ? e.target.value === ""
              ? ""
              : Number(e.target.value)
            : e.target.value;
        setValue(newValue);
      }}
      className="mt-2 w-full px-3 py-2 border rounded-md focus:outline-none"
    />
  );
}
