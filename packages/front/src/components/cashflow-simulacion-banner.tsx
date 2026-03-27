"use client";
import { useRouter } from "next/navigation";
import { FlaskConical, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useGetSimulacion } from "@/hooks/cashflow-simulacion";

interface Props {
    simulacionId: number;
}

export default function CashflowSimulacionBanner({ simulacionId }: Props) {
    const router = useRouter();
    const { data: simulacion } = useGetSimulacion(simulacionId);

    return (
        <Alert className="border-amber-300 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-700">
            <FlaskConical className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <AlertDescription className="flex items-center justify-between">
                <span className="text-amber-800 dark:text-amber-300">
                    Estás viendo la simulación:{" "}
                    <strong>{simulacion?.nombre ?? `#${simulacionId}`}</strong>
                    {simulacion?.descripcion && (
                        <span className="text-amber-600 dark:text-amber-400 ml-2 text-sm">
                            — {simulacion.descripcion}
                        </span>
                    )}
                </span>
                <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 border-amber-400 text-amber-800 hover:bg-amber-100 dark:text-amber-300 dark:border-amber-700 dark:hover:bg-amber-950/40"
                    onClick={() => router.push("/cashflow")}
                >
                    <ArrowLeft className="w-3 h-3" />
                    Volver al cashflow real
                </Button>
            </AlertDescription>
        </Alert>
    );
}
