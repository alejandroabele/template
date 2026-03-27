import { Suspense } from "react";
import CashflowPage from "@/components/pages/cashflow";

interface Props {
    params: Promise<{ id: string }>;
}

export default async function Page({ params }: Props) {
    const { id } = await params;
    const simulacionId = parseInt(id, 10);

    return (
        <Suspense
            fallback={
                <div className="flex items-center justify-center p-12">
                    <div className="text-muted-foreground">Cargando simulación...</div>
                </div>
            }
        >
            <CashflowPage simulacionId={simulacionId} />
        </Suspense>
    );
}
