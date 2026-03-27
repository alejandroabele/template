"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContratoMarcoForm from "../forms/contrato-marco-form";
import { ContratosMarcoTalonarioTable } from "@/components/tables/contratos-marco-talonario-table";
import { ContratosMarcoPresupuestoTable } from "@/components/tables/contratos-marco-presupuesto-table";
import { CardContent, Card } from "@/components/ui/card";
import { Home, DollarSign, TrafficCone, ChartLine } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import React from "react";
import { ContratoMarco } from "@/types";
import { ContratoConsumoChart } from "@/components/charts/contrato-marco/contrato-consumo-chart";
import { ContratoOrdenesTipoChart } from "@/components/charts/contrato-marco/contrato-ordenes-tipo-chart";

type ContratoMarcoProps = {
  data?: ContratoMarco;
};

export default function ContratoMarcoPage({ data }: ContratoMarcoProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Obtener el tab inicial de los query params o usar 'informacion' por defecto
  const initialTab = searchParams.get("tab") || "informacion";
  const [tabValue, setTabValue] = React.useState(initialTab);

  // Función para manejar el cambio de tab y actualizar la URL
  const handleTabChange = (newTab: string) => {
    setTabValue(newTab);

    // Crear nuevos query params manteniendo los existentes
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", newTab);

    // Actualizar la URL sin recargar la página
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return (
    <Tabs value={tabValue} onValueChange={handleTabChange} className="">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="informacion" className="text-center flex gap-2">
          <span className="hidden sm:inline">Información</span>
          <Home className="w-5 h-5" />
        </TabsTrigger>
        <TabsTrigger
          disabled={!data?.id}
          value="talonario"
          className="text-center flex gap-2"
        >
          <span className="hidden sm:inline">Talonarios</span>
          <DollarSign className="w-5 h-5" />
        </TabsTrigger>
        <TabsTrigger
          disabled={!data?.id}
          value="presupuestos"
          className="text-center flex gap-2"
        >
          <span className="hidden sm:inline">Ordenes</span>
          <TrafficCone className="w-5 h-5" />
        </TabsTrigger>
        <TabsTrigger
          disabled={!data?.id}
          value="resumen"
          className="text-center flex gap-2"
        >
          <span className="hidden sm:inline">Estadisticas</span>
          <ChartLine className="w-5 h-5" />
        </TabsTrigger>
      </TabsList>
      <TabsContent value="informacion">
        <Card>
          <CardContent>
            <ContratoMarcoForm data={data} />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="talonario">
        <ContratosMarcoTalonarioTable id={data?.id} />
      </TabsContent>
      <TabsContent value="presupuestos">
        <ContratosMarcoPresupuestoTable id={data?.id} />
      </TabsContent>
      <TabsContent value="resumen">
        {data?.id ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ContratoConsumoChart contratoId={data.id} />
            <ContratoOrdenesTipoChart contratoId={data.id} />
          </div>
        ) : (
          <p className="text-muted-foreground">
            Seleccione un contrato para ver el resumen
          </p>
        )}
      </TabsContent>
    </Tabs>
  );
}
