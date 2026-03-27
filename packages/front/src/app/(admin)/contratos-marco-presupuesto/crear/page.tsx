// "use client";

// import Form from "@/components/forms/contrato-marco-presupuesto-form/";
// import { PageTitle } from "@/components/ui/page-title";
// import React from "react";
// import { useSearchParams } from "next/navigation";
// import { useGetContratoMarcoByIdQuery } from "@/hooks/contrato-marco";

// export default function Page() {
//   const searchParams = useSearchParams();
//   const contratoMarcoId = searchParams.get("contratoMarcoId");
//   const { data, isLoading, isFetching } = useGetContratoMarcoByIdQuery(
//     Number(contratoMarcoId)
//   );
//   if (isLoading || isFetching) return <>Cargando...</>;
//   const tipo = searchParams.get("tipo");
//   return (
//     <>
//       <PageTitle title={"Crear orden de " + tipo} />
//       <Form contratoMarco={data} tipo={tipo || ""} />
//     </>
//   );
// }
"use client";

import Form from "@/components/forms/contrato-marco-presupuesto-form/";
import { PageTitle } from "@/components/ui/page-title";
import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useGetContratoMarcoByIdQuery } from "@/hooks/contrato-marco";

export default function Page() {
  return (
    <Suspense fallback={<>Cargando...</>}>
      <PageContent />
    </Suspense>
  );
}

function PageContent() {
  const searchParams = useSearchParams();
  const contratoMarcoId = searchParams.get("contratoMarcoId");
  const { data, isLoading, isFetching } = useGetContratoMarcoByIdQuery(
    Number(contratoMarcoId)
  );
  if (isLoading || isFetching) return <>Cargando...</>;
  const tipo = searchParams.get("tipo");
  return (
    <>
      <PageTitle title={"Crear orden de " + tipo} />
      <Form contratoMarco={data} tipo={tipo || ""} />
    </>
  );
}
