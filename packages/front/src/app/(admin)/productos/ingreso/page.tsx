import Form from "@/components/forms/ingreso-mercaderia-form";
import { PageTitle } from "@/components/ui/page-title";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ ordenCompraId?: string }>;
}) {
  const { ordenCompraId } = await searchParams;

  return (
    <>
      <PageTitle title="Ingreso de Mercadería" />
      <Form ordenCompraId={ordenCompraId} />
    </>
  );
}
