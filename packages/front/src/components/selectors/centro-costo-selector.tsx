"use client";

import * as React from "react";
import { ChevronsUpDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDebounce } from "use-debounce";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import type { CentroCosto } from "@/types";
import { useGetCentroCostosQuery } from "@/hooks/centro-costo";
import { cn } from "@/lib/utils";

interface SearchProps {
  selectedResult?: Pick<CentroCosto, "id" | "nombre">;
  onSelectResult: (centroCosto: Pick<CentroCosto, "id" | "nombre">) => void;
}

export function Search({ selectedResult, onSelectResult }: SearchProps) {
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleSelectResult = (centroCosto: CentroCosto) => {
    onSelectResult(centroCosto);
  };

  return (
    <Command
      shouldFilter={false}
      className="h-auto rounded-lg border border-b-0 shadow-md"
    >
      <CommandInput
        value={searchQuery}
        onValueChange={setSearchQuery}
        placeholder="Buscar centro de costo..."
      />

      <SearchResults
        query={searchQuery}
        selectedResult={selectedResult}
        onSelectResult={handleSelectResult}
      />
    </Command>
  );
}

interface SearchResultsProps {
  query: string;
  selectedResult: SearchProps["selectedResult"];
  onSelectResult: SearchProps["onSelectResult"];
}

function SearchResults({
  query,
  selectedResult,
  onSelectResult,
}: SearchResultsProps) {
  const [debouncedSearchQuery] = useDebounce(query, 500);
  const enabled = !!debouncedSearchQuery;

  const {
    data,
    isLoading: isLoadingOrig,
    isError,
  } = useGetCentroCostosQuery({
    pagination: { pageIndex: 0, pageSize: 50 },
    columnFilters: [{ id: "nombre", value: debouncedSearchQuery }],
    globalFilter: "",
    sorting: [],
  });

  const isLoading = enabled && isLoadingOrig;

  return (
    <CommandList>
      {isLoading && <div className="p-4 text-sm">Buscando...</div>}
      {!isError && !isLoading && !data?.length && (
        <div className="p-4 text-sm">No se encontraron registros</div>
      )}
      {isError && (
        <div className="p-4 text-sm">Hubo un error en la búsqueda</div>
      )}

      {data?.map(({ id, nombre, codigo }) => {
        return (
          <CommandItem
            key={id}
            onSelect={() => onSelectResult({ id, nombre })}
            value={String(id)}
          >
            <Check
              className={cn(
                "mr-2 h-4 w-4",
                selectedResult?.id === id ? "opacity-100" : "opacity-0"
              )}
            />
            {nombre} {codigo && `(${codigo})`}
          </CommandItem>
        );
      })}
    </CommandList>
  );
}

interface CentroCostoSelectorProps {
  onChange?: (centroCosto: CentroCosto | null) => void;
  centroCosto?: CentroCosto;
  disabled?: boolean;
  onClear?: () => void;
}

export function CentroCostoSelector({
  centroCosto,
  onChange,
  onClear,
  disabled = false,
}: CentroCostoSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<
    Pick<CentroCosto, "id" | "nombre"> | undefined
  >(centroCosto);

  const handleSetActive = React.useCallback(
    (centroCosto: any) => {
      setSelected(centroCosto);
      if (onChange) {
        onChange(centroCosto);
      }
      setOpen(false);
    },
    [onChange]
  );

  const handleClear = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setSelected(undefined);
      if (onClear) {
        onClear();
      }
      setOpen(false);
    },
    [onClear]
  );

  const displayName = selected ? selected.nombre : "Seleccione centro de costo";

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn("justify-between w-full  text-wrap")}
          disabled={disabled}
        >
          {displayName}

          {selected && onClear ? (
            <span
              onClick={handleClear}
              className="ml-2 h-4 w-4 shrink-0 opacity-50 hover:opacity-100 cursor-pointer inline-flex items-center justify-center"
            >
              ✕
            </span>
          ) : (
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <Search selectedResult={selected} onSelectResult={handleSetActive} />
      </PopoverContent>
    </Popover>
  );
}
