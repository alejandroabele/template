"use client";

import { ContratoMarco } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDownloadArchivoByIdQuery } from "@/hooks/archivo";
import { useState, useEffect } from "react";
import { getContratoEstado } from "./columns";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { Table } from "@tanstack/react-table";
import { formatDate } from "@/utils/date";
import { formatMoney, formatCurrency } from "@/utils/number";

interface ContratosMarcoGridProps {
  data: ContratoMarco[];
  table: Table<ContratoMarco>;
}

const ClientLogo = ({
  logo,
  clientName,
}: {
  logo?: any;
  clientName: string;
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { data: blob } = useDownloadArchivoByIdQuery(logo?.id, {
    enabled: !!logo?.id,
  });

  useEffect(() => {
    if (blob) {
      const url = URL.createObjectURL(blob);
      setImageUrl(url);
      return () => URL.revokeObjectURL(url); // Cleanup
    }
  }, [blob]);

  // Si hay logo y se cargó correctamente, mostrarlo
  if (imageUrl) {
    return (
      <div className="relative w-20 h-20 flex-shrink-0">
        <Image
          src={imageUrl}
          alt={`Logo de ${clientName}`}
          fill
          className="object-cover rounded-lg border-2 border-slate-200 dark:border-slate-700"
          onError={() => setImageUrl(null)}
        />
      </div>
    );
  }

  // Fallback al placeholder
  return (
    <div className="relative w-20 h-20 flex-shrink-0">
      <Image
        src="/placeholder.svg"
        alt={`Placeholder para ${clientName}`}
        fill
        className="object-cover rounded-lg opacity-60 border-2 border-slate-200 dark:border-slate-700"
      />
    </div>
  );
};

export function ContratosMarcoGrid({ data, table }: ContratosMarcoGridProps) {
  const router = useRouter();

  const handleCardClick = (contratoId: number) => {
    router.push(`/contratos-marco/${contratoId}`);
  };

  const handleCreateContract = () => {
    router.push("/contratos-marco/crear");
  };

  return (
    <div className="space-y-4">
      {/* Botón para crear nuevo contrato */}
      <div className="flex justify-end">
        <Button onClick={handleCreateContract} className="gap-2" size={"sm"}>
          <Plus className="h-4 w-4" />
          Agregar
        </Button>
      </div>

      {/* Grid de contratos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {data.map((contrato) => {
          const status = getContratoEstado(
            contrato.fechaInicio,
            contrato.fechaFin
          );

          return (
            <Card
              key={contrato.id}
              className="hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-slate-200 dark:border-slate-700 shadow-md cursor-pointer hover:scale-[1.02] hover:border-primary/30 focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 dark:bg-slate-800 dark:hover:shadow-slate-900/50"
              onClick={() => handleCardClick(contrato.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleCardClick(contrato.id);
                }
              }}
              aria-label={`Ver contrato de ${contrato.cliente.nombre}`}
            >
              <CardContent className="p-6">
                {/* Header con logo y cliente */}
                <div className="flex items-center gap-4 mb-5">
                  <ClientLogo
                    logo={contrato.cliente.logo}
                    clientName={contrato.cliente.nombre}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base truncate text-slate-900 dark:text-slate-100 mb-1">
                      {contrato.cliente.nombre}
                    </h3>
                    <p className="text-sm text-muted-foreground font-medium mb-2">
                      Contrato: {contrato.nroContrato}
                    </p>
                    <div
                      className={`px-2 py-1 rounded text-sm font-medium text-center w-fit ${status.colors.bg} ${status.colors.text}`}
                    >
                      {status.label}
                    </div>
                  </div>
                </div>

                {/* Fechas */}
                <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                  <div>
                    <p className="text-muted-foreground font-medium">Inicio</p>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      {formatDate(contrato.fechaInicio)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground font-medium">Fin</p>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      {formatDate(contrato.fechaFin)}
                    </p>
                  </div>
                </div>

                {/* Monto */}
                <div className="text-center pt-3 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-sm text-muted-foreground font-medium mb-1">
                    Monto
                  </p>
                  <p className="font-bold text-xl text-primary dark:text-primary-foreground">
                    ${formatCurrency(Number(contrato?.monto))}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Paginación reutilizada */}
      <DataTablePagination table={table} hidePageSizeSelector={true} />
    </div>
  );
}
