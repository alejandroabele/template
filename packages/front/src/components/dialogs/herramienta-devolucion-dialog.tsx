import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { HerramientaDevolucionForm } from "@/components/forms/herramienta-devolucion-form";
import type { Dispatch, SetStateAction } from "react";

type Props = {
    herramienta: any;
    open: boolean;
    onClose: () => void;
    prestamo?: {
        personaId: number;
        personaNombre: string;
        cantidad: number;
    };
};

export function HerramientasDevolverDialog({ herramienta, open, onClose, prestamo }: Props) {
    const setOpen: Dispatch<SetStateAction<boolean>> = (value) => {
        if (!value) onClose();
    };

    if (!open) return null;

    return (
        <Dialog open={open} onOpenChange={setOpen} modal={true}>
            <DialogContent
                className="sm:max-w-md pointer-events-auto"
                onInteractOutside={(e) => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle>Registrar devolución</DialogTitle>
                    <DialogDescription>
                        {herramienta?.nombre}
                        {prestamo
                            ? ` — ${prestamo.personaNombre} tiene ${prestamo.cantidad} prestadas`
                            : ` — Prestadas: ${herramienta?.prestadas ?? 0} ${herramienta?.unidadMedida}`
                        }
                    </DialogDescription>
                </DialogHeader>
                <HerramientaDevolucionForm
                    herramienta={herramienta}
                    setOpen={setOpen}
                    personaId={prestamo?.personaId}
                    personaNombre={prestamo?.personaNombre}
                    cantidadMaxima={prestamo?.cantidad}
                />
            </DialogContent>
        </Dialog>
    );
}
