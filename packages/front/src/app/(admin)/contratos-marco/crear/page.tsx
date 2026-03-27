import ContratoMarco from "@/components/pages/contrato-marco";
import { PageTitle } from "@/components/ui/page-title";
import { Suspense } from "react";

function PageContent() {
  return (
    <>
      <PageTitle title="Crear Contrato Marco" />
      <ContratoMarco />
    </>
  );
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <PageContent />
    </Suspense>
  );
}
