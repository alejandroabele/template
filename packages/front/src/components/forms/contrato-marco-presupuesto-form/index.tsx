"use client";

import { ContratoMarcoPresupuesto, ContratoMarco } from "@/types";
import ContratoMarcoPresupuestoServicio from "./contrato-marco-presupuesto-servicio-form";
import ContratoMarcoPresupuestoProducto from "./contrato-marco-presupuesto-producto-form";
import { notFound } from "next/navigation";

type Props = {
  tipo: string;
  data?: ContratoMarcoPresupuesto;
  contratoMarco?: ContratoMarco;
};

export default function Index({ tipo, data, contratoMarco }: Props) {
  if (tipo === "servicio") {
    return (
      <ContratoMarcoPresupuestoServicio
        data={data}
        contratoMarco={contratoMarco}
      />
    );
  }

  if (tipo === "producto") {
    return (
      <ContratoMarcoPresupuestoProducto
        data={data}
        contratoMarco={contratoMarco}
      />
    );
  }

  return notFound();
}
