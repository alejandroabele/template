/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Oferta } from "@/types";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { hasPermission } from "@/hooks/use-access";
import { PERMISOS } from "@/constants/permisos";
import OfertaAprobacionForm from "@/components/features/oferta-aprobacion-stepper";
import { useGetOfertaAprobacionByOferta } from "@/hooks/oferta-aprobacion";

type OfertaControlesProps = {
  data: Oferta;
  tieneArticulosExtra: boolean;
};

export default function OfertaControles({ data }: OfertaControlesProps) {
  const router = useRouter();

  const { data: aprobaciones = [], isLoading } = useGetOfertaAprobacionByOferta(
    data?.id || 0
  );

  // Permisos
  const puedeVerAprobaciones = hasPermission(PERMISOS.OFERTA_VER_APROBACIONES);

  if (!puedeVerAprobaciones) {
    return (
      <div className="p-4 text-center text-gray-500">
        No tienes permisos para ver las aprobaciones
      </div>
    );
  }

  if (isLoading) {
    return <div className="p-4 text-center">Cargando aprobaciones...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="border-b pb-3">
          <h2 className="text-lg font-semibold text-gray-900">
            Aprobaciones de presupuesto
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Todas las aprobaciones deben estar completadas para poder crear la
            orden de compra
          </p>
        </div>

        {aprobaciones.length === 0 ? (
          <div className="p-4 text-center text-gray-500 border rounded-md">
            No hay aprobaciones configuradas para este presupuesto
          </div>
        ) : (
          <OfertaAprobacionForm
            aprobaciones={aprobaciones}
            estadoOferta={data?.estado?.codigo}
          />
        )}
      </div>

      <div className="flex gap-2 items-center">
        <Button type="button" onClick={() => router.back()} variant={"link"}>
          Volver
        </Button>
      </div>
    </div>
  );
}
