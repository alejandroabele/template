import { ContactoTipoTable } from "@/components/tables/contacto-tipo-table";
import { PageTitle } from "@/components/ui/page-title";

export default function ContactoTipo() {
  return (
    <>
      <PageTitle title="Tipos de Contacto" />
      <ContactoTipoTable />
    </>
  );
}
