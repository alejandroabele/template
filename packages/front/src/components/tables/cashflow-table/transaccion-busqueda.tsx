"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { useDebounce } from "use-debounce";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useSearchCashflowTransaccionesQuery } from "@/hooks/cashflow-transaccion";
import { useSearchSimulacionTransaccionesQuery } from "@/hooks/cashflow-simulacion";
import { useCashflowStore } from "./store";
import { formatMoney } from "@/utils/number";
import type { CashflowTransaccion, CashflowSimulacionTransaccion, Query } from "@/types";

const PAGE_SIZE = 20;

interface TransaccionBusquedaProps {
  simulacionId?: number;
}

export function TransaccionBusqueda({ simulacionId }: TransaccionBusquedaProps) {
  const { openEditTransaction } = useCashflowStore();

  const [abierto, setAbierto] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [page, setPage] = useState(0);
  const [resultados, setResultados] = useState<(CashflowTransaccion | CashflowSimulacionTransaccion)[]>([]);
  const [hayMas, setHayMas] = useState(true);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const [debouncedQ] = useDebounce(inputValue, 400);

  const query: Query = {
    pagination: { pageIndex: page, pageSize: PAGE_SIZE },
    columnFilters: debouncedQ ? [{ id: "descripcion", value: debouncedQ }] : [],
    sorting: [{ id: "fecha", desc: true }],
  };

  const habilitado = abierto && debouncedQ.length >= 2;

  // Hook real (siempre se llama para respetar reglas de hooks)
  const { data: dataReal, isLoading: isLoadingReal, isFetching: isFetchingReal } =
    useSearchCashflowTransaccionesQuery(query, habilitado && !simulacionId);

  // Hook de simulación (siempre se llama para respetar reglas de hooks)
  const { data: dataSim, isLoading: isLoadingSim, isFetching: isFetchingSim } =
    useSearchSimulacionTransaccionesQuery(simulacionId ?? 0, query, habilitado && !!simulacionId);

  const data = simulacionId ? dataSim : dataReal;
  const isLoading = simulacionId ? isLoadingSim : isLoadingReal;
  const isFetching = simulacionId ? isFetchingSim : isFetchingReal;

  // Resetear resultados cuando cambia el texto buscado
  useEffect(() => {
    setPage(0);
    setResultados([]);
    setHayMas(true);
  }, [debouncedQ]);

  // Acumular resultados paginados
  useEffect(() => {
    if (!data) return;
    if (page === 0) {
      setResultados(data);
    } else {
      setResultados((prev) => [...prev, ...data]);
    }
    setHayMas(data.length === PAGE_SIZE);
  }, [data, page]);

  // Mostrar popover cuando hay texto y está abierto
  useEffect(() => {
    setPopoverOpen(abierto && debouncedQ.length >= 2);
  }, [abierto, debouncedQ]);

  // Focus al abrir
  useEffect(() => {
    if (abierto) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [abierto]);

  const handleScroll = useCallback(() => {
    const el = listRef.current;
    if (!el || isFetching || !hayMas) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    if (scrollHeight - scrollTop - clientHeight < 40) {
      setPage((p) => p + 1);
    }
  }, [isFetching, hayMas]);

  const handleSeleccionar = (transaccion: CashflowTransaccion | CashflowSimulacionTransaccion) => {
    openEditTransaction(transaccion as CashflowTransaccion);
    setAbierto(false);
    setPopoverOpen(false);
    setInputValue("");
    setResultados([]);
    setPage(0);
  };

  const handleCerrar = () => {
    setAbierto(false);
    setPopoverOpen(false);
    setInputValue("");
    setResultados([]);
    setPage(0);
  };

  if (!abierto) {
    return (
      <Button
        variant="outline"
        size="icon"
        onClick={() => setAbierto(true)}
        title="Buscar transacción"
      >
        <Search className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <div className="relative flex items-center">
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <div className="flex items-center rounded-md border border-input bg-background px-2 gap-1 h-10 w-64 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-0">
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Buscar transacción..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground min-w-0"
            />
            <button
              type="button"
              onClick={handleCerrar}
              className="h-5 w-5 shrink-0 flex items-center justify-center rounded text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="p-0 w-[420px]"
          align="end"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <Command>
            <CommandList
              ref={listRef}
              onScroll={handleScroll}
              className="max-h-[320px] overflow-y-auto"
            >
              {isLoading && page === 0 ? (
                <div className="py-4 text-center text-sm text-muted-foreground">
                  Buscando...
                </div>
              ) : resultados.length === 0 ? (
                <CommandEmpty>No se encontraron transacciones</CommandEmpty>
              ) : (
                <>
                  {resultados.map((t) => (
                    <CommandItem
                      key={t.id}
                      value={`${t.id}`}
                      onSelect={() => handleSeleccionar(t as CashflowTransaccion | CashflowSimulacionTransaccion)}
                      className="flex items-center gap-2 px-3 py-2 cursor-pointer"
                    >
                      <span
                        className={`h-2 w-2 rounded-full shrink-0 ${
                          t.categoria?.tipo === "ingreso"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      />
                      <span className="text-muted-foreground text-xs shrink-0 w-14">
                        {format(new Date(t.fecha + "T00:00:00"), "dd/MM/yy")}
                      </span>
                      <span className="flex-1 truncate text-sm">
                        {t.descripcion ?? "—"}
                      </span>
                      <span className="text-xs font-mono shrink-0 text-muted-foreground">
                        {formatMoney(parseFloat(t.monto))}
                      </span>
                    </CommandItem>
                  ))}
                  {isFetching && (
                    <div className="py-2 text-center text-xs text-muted-foreground">
                      Cargando más...
                    </div>
                  )}
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
