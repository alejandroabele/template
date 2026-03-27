"use client";
import { FlaskConical } from "lucide-react";
import CashflowSimulacionTable from "@/components/tables/cashflow-simulacion-table";

export default function CashflowSimulacionesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <FlaskConical className="w-6 h-6 text-muted-foreground" />
        <h1 className="text-2xl font-semibold">Simulaciones de Cashflow</h1>
      </div>

      <CashflowSimulacionTable />
    </div>
  );
}
