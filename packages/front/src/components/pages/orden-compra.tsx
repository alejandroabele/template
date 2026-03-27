"use client";
import { OrdenCompraForm } from "@/components/forms/orden-compra-form";
import { OrdenCompra } from "@/types";

type OrdenCompraPageProps = {
  data: OrdenCompra;
};

export default function OrdenCompraPage({ data }: OrdenCompraPageProps) {
  return <OrdenCompraForm data={data} mode="orden" />;
}
