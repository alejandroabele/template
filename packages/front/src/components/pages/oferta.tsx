/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import OfertaForm from "@/components/forms/oferta-form";
import OfertaAprobacionForm from "@/components/features/oferta-aprobacion-stepper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Oferta, Solcom } from "@/types";
import { useGetOfertaAprobacionByOferta } from "@/hooks/oferta-aprobacion";
import React from "react";
import { Card, CardContent } from "../ui/card";
import { SolcomTable } from "@/components/tables/solcom-table";

type OfertaPageProps = {
  oferta?: Oferta;
};

export default function OfertaPage({ oferta }: OfertaPageProps) {
  // Obtener las aprobaciones de la oferta (solo si está editando)
  const { data: aprobaciones = [] } = useGetOfertaAprobacionByOferta(
    oferta?.id || 0
  );
  console.log({ aprobaciones });

  // Obtener IDs de SOLCOMs únicas de los items de la oferta
  const solcomIds = React.useMemo(() => {
    if (!oferta?.items || oferta.items.length === 0) return [];

    // Extraer IDs de SOLCOMs únicas de los items
    const solcomIdsSet = new Set<number>();
    oferta.items.forEach(item => {
      if (item.solcomItem?.solcom?.id) {
        solcomIdsSet.add(item.solcomItem.solcom.id);
      }
    });

    return Array.from(solcomIdsSet);
  }, [oferta?.items]);

  const hasSolcoms = solcomIds.length > 0;

  return (
    <Tabs defaultValue="informacion" className="w-full">
      <TabsList className={`grid w-full grid-cols-2`}>
        <TabsTrigger value="informacion">Información</TabsTrigger>
        <TabsTrigger value="solicitudes" disabled={!hasSolcoms}>
          Solicitudes de Compra ({solcomIds.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="informacion">
        {aprobaciones.length > 0 && (
          <OfertaAprobacionForm
            aprobaciones={aprobaciones}
            estadoOferta={oferta?.estado?.codigo}
          />
        )}
        <Card>
          <CardContent>
            <OfertaForm data={oferta} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="solicitudes">
        {hasSolcoms ? (
          <SolcomTable solcomIds={solcomIds} />
        ) : (
          <p className="text-muted-foreground">
            No hay solicitudes de compra asociadas a esta oferta
          </p>
        )}
      </TabsContent>
    </Tabs>
  );
}
