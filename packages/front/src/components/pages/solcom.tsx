"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SolcomForm from "../forms/solcom-form";
import { SolcomItemsTable } from "@/components/tables/solcom-items-table";
import { OrdenCompraTable } from "@/components/tables/orden-compra-table";
import { OfertaTable } from "@/components/tables/oferta-table";
import { CardContent, Card } from "@/components/ui/card";
import { Home, FileText, Package, ShoppingCart } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import React from "react";
import { Solcom } from "@/types";
import { hasPermission } from "@/hooks/use-access";
import { PERMISOS } from "@/constants/permisos";

type SolcomPageProps = {
  data?: Solcom;
};

export default function SolcomPage({ data }: SolcomPageProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Obtener el tab inicial de los query params o usar 'informacion' por defecto
  const initialTab = searchParams.get("tab") || "informacion";
  const [tabValue, setTabValue] = React.useState(initialTab);
  const puedeVerOrdenesCompra = hasPermission(PERMISOS.ORDEN_COMPRA_VER);
  const puedeVerOfertas = hasPermission(PERMISOS.OFERTA_VER);

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
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="informacion" className="text-center flex gap-2">
          <span className="hidden sm:inline">Información</span>
          <Home className="w-5 h-5" />
        </TabsTrigger>
        <TabsTrigger
          disabled={!data?.id}
          value="items"
          className="text-center flex gap-2"
        >
          <span className="hidden sm:inline">Items</span>
          <Package className="w-5 h-5" />
        </TabsTrigger>
        <TabsTrigger
          disabled={!data?.id || !puedeVerOfertas}
          value="ofertas"
          className="text-center flex gap-2"
        >
          <span className="hidden sm:inline">Presupuestos</span>
          <ShoppingCart className="w-5 h-5" />
        </TabsTrigger>
        <TabsTrigger
          disabled={!data?.id || !puedeVerOrdenesCompra}
          value="oc"
          className="text-center flex gap-2"
        >
          <span className="hidden sm:inline">Órdenes</span>
          <FileText className="w-5 h-5" />
        </TabsTrigger>
      </TabsList>
      <TabsContent value="informacion">
        <Card>
          <CardContent>
            <SolcomForm data={data} />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="items">
        {data?.id ? (
          <SolcomItemsTable solcomId={data.id} toolbar={false} />
        ) : (
          <p className="text-muted-foreground">
            Seleccione una SOLCOM para ver los items
          </p>
        )}
      </TabsContent>
      <TabsContent value="ofertas">
        {data?.id ? (
          <OfertaTable solcomId={data.id} />
        ) : (
          <p className="text-muted-foreground">
            Seleccione una SOLCOM para ver las ofertas
          </p>
        )}
      </TabsContent>
      <TabsContent value="oc">
        {data?.id ? (
          <OrdenCompraTable solcomId={data.id} />
        ) : (
          <p className="text-muted-foreground">
            Seleccione una SOLCOM para ver las órdenes de compra
          </p>
        )}
      </TabsContent>
    </Tabs>
  );
}
