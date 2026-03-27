"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InformacionForm from "../forms/alquiler-form";
import { CardContent, Card } from "@/components/ui/card";
import { AlquilerPreciosTable } from "@/components/tables/alquileres-precios-table";
import { FacturaTable } from "@/components/tables/factura-table";
import { CobroTable } from "@/components/tables/cobro-table";
import { useStore } from "@/components/tables/alquileres-table/store";
import { Home, DollarSign, FileText, CreditCard, Wrench } from "lucide-react";
import { AlquilerPresupuestosTable } from "../tables/alquiler-presupuesto-table";
import { useSearchParams, useRouter } from "next/navigation";
import React from "react";
import { PERMISOS } from "@/constants/permisos";
import { hasPermission } from "@/hooks/use-access";

type AlquileresProps = {
  id?: string;
};

export default function Alquileres({ id }: AlquileresProps) {
  const idParams = id ? parseInt(id) : null;
  const recursoId = useStore((state) => state.recursoId);
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
        {hasPermission(PERMISOS.ALQUILERES_PRECIO_VER) && (
          <TabsTrigger
            disabled={!id}
            value="precios"
            className="text-center flex gap-2"
          >
            <span className="hidden sm:inline">Precios</span>
            <DollarSign className="w-5 h-5" />
          </TabsTrigger>
        )}
        {hasPermission(PERMISOS.ALQUILERES_FACTURAS_VER) && (
          <TabsTrigger
            disabled={!id}
            value="facturacion"
            className="text-center flex gap-2"
          >
            <span className="hidden sm:inline">Facturación</span>
            <FileText className="w-5 h-5" />
          </TabsTrigger>
        )}
        {hasPermission(PERMISOS.ALQUILERES_COBRANZAS_VER) && (
          <TabsTrigger
            disabled={!id}
            value="cobranzas"
            className="text-center flex gap-2"
          >
            <span className="hidden sm:inline">Cobranzas</span>
            <CreditCard className="w-5 h-5" />
          </TabsTrigger>
        )}
        {hasPermission(PERMISOS.ALQUILERES_MANTENIMIENTO_VER) && (
          <TabsTrigger
            disabled={!id}
            value="mantenimientos"
            className="text-center flex gap-2"
          >
            <span className="hidden sm:inline">Mantenimientos</span>
            <Wrench className="w-5 h-5" />
          </TabsTrigger>
        )}
      </TabsList>
      <TabsContent value="informacion">
        <Card>
          <CardContent>
            <InformacionForm id={idParams} />
          </CardContent>
        </Card>
      </TabsContent>
      {hasPermission(PERMISOS.ALQUILERES_PRECIO_VER) && (
        <TabsContent value="precios">
          <AlquilerPreciosTable id={recursoId} />
        </TabsContent>
      )}
      {hasPermission(PERMISOS.ALQUILERES_FACTURAS_VER) && (
        <TabsContent value="facturacion">
          <FacturaTable id={idParams} modelo="alquiler" />
        </TabsContent>
      )}
      {hasPermission(PERMISOS.COBRO_VER) && (
        <TabsContent value="cobranzas">
          <CobroTable id={idParams} modelo="alquiler" />
        </TabsContent>
      )}
      {hasPermission(PERMISOS.ALQUILERES_MANTENIMIENTO_VER) && (
        <TabsContent value="mantenimientos">
          <AlquilerPresupuestosTable id={recursoId} />
        </TabsContent>
      )}
    </Tabs>
  );
}
