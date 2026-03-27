import { CalendarioContactos } from "@/components/calendars/contactos";
// import { CalendarioContactos } from "@/components/features/calendario-contactos";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <PageContent />
    </Suspense>
  );
}

function PageContent() {
  return (
    <>
      <CalendarioContactos />
    </>
  );
}
