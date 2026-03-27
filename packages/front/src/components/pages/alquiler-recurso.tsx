"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InformacionForm from "../forms/alquiler-recurso-form";
import { CardContent, Card } from "@/components/ui/card";
import { AlquilerPreciosTable } from "@/components/tables/alquileres-precios-table";
import { AlquilerPresupuestosTable } from "../tables/alquiler-presupuesto-table";
import { Home, DollarSign, Wrench } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import React from "react";

type AlquileresProps = {
  id?: string;
};

export default function Alquileres({ id }: AlquileresProps) {
  const idParams = id ? parseInt(id) : null;
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialTab = searchParams.get("tab") || "informacion";
  const [tabValue, setTabValue] = React.useState(initialTab);

  const handleTabChange = (newTab: string) => {
    setTabValue(newTab);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", newTab);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return (
    <Tabs value={tabValue} onValueChange={handleTabChange}>
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="informacion" className="text-center flex gap-2">
          <span className="hidden sm:inline">Información</span>
          <Home className="w-5 h-5" />
        </TabsTrigger>
        <TabsTrigger disabled={!id} value="precios" className="text-center flex gap-2">
          <span className="hidden sm:inline">Precios</span>
          <DollarSign className="w-5 h-5" />
        </TabsTrigger>
        <TabsTrigger disabled={!id} value="mantenimientos" className="text-center flex gap-2">
          <span className="hidden sm:inline">Mantenimientos</span>
          <Wrench className="w-5 h-5" />
        </TabsTrigger>
      </TabsList>
      <TabsContent value="informacion">
        <Card>
          <CardContent>
            <InformacionForm id={idParams} />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="precios">
        <AlquilerPreciosTable id={idParams} />
      </TabsContent>
      <TabsContent value="mantenimientos">
        <AlquilerPresupuestosTable id={idParams} />
      </TabsContent>
    </Tabs>
  );
}
