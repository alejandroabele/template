import { Suspense } from "react";
import CashflowPage from "@/components/pages/cashflow";

function CashflowPageWrapper() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-12">
          <div className="text-muted-foreground">Cargando...</div>
        </div>
      }
    >
      <CashflowPage />
    </Suspense>
  );
}

export default function Page() {
  return <CashflowPageWrapper />;
}
