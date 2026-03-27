"use client";

import Form from "@/components/forms/solcom-form";
import { useSearchParams } from "next/navigation";
import { useGetInventarioQuery } from "@/hooks/inventario";
import { useGetPresupuestoByIdQuery } from "@/hooks/presupuestos";
import { Suspense } from "react";
import { Loading } from "@/components/loading";
import type { Solcom } from "@/types";

/* ================= funciones auxiliares ================= */

function parsearItems(itemsParam: string | null) {
  if (!itemsParam) return [];

  try {
    return JSON.parse(itemsParam).map(
      ([inventarioId, cantidad]: [number, number]) => ({
        inventarioId,
        cantidad,
      })
    );
  } catch {
    return [];
  }
}

function construirSolcomInicial({
  items,
  inventarios,
  presupuesto,
}: {
  items: { inventarioId: number; cantidad: number }[];
  inventarios: any[];
  presupuesto: any;
}): Partial<Solcom> {
  const inventarioPorId = new Map(inventarios.map((i) => [i.id, i]));

  return {
    presupuestoId: presupuesto?.id,
    presupuesto,
    items: items.map(({ inventarioId, cantidad }) => ({
      inventarioId,
      inventario: inventarioPorId.get(inventarioId),
      inventarioConversionId: 0,
      inventarioConversion: null,
      descripcion: "",
      cantidad: String(cantidad),
      minimo: "",
      maximo: "",
    })),
  };
}

/* ================= componente ================= */

function CreateSolcomContent() {
  const params = useSearchParams();

  const presupuestoId = Number(params.get("presupuestoId"));
  const items = parsearItems(params.get("items"));

  const inventarioIds = [...new Set(items.map((i) => i.inventarioId))];

  const { data: presupuesto, isLoading: cargandoPresupuesto } =
    useGetPresupuestoByIdQuery(presupuestoId);

  const { data: inventarios = [], isLoading: cargandoInventarios } =
    useGetInventarioQuery(
      {
        pagination: { pageIndex: 0, pageSize: 100 },
        columnFilters:
          inventarioIds.length > 0 ? [{ id: "id", value: inventarioIds }] : [],
      },
      { enabled: inventarioIds.length > 0 }
    );

  if (cargandoPresupuesto || cargandoInventarios) {
    return <Loading />;
  }

  const dataInicial = construirSolcomInicial({
    items,
    inventarios,
    presupuesto,
  });

  return <Form data={dataInicial as Solcom} />;
}

export default function CreateSolcom() {
  return (
    <Suspense fallback={<Loading />}>
      <CreateSolcomContent />
    </Suspense>
  );
}
