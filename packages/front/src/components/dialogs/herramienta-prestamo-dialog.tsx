import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { HerramientaPrestamoForm } from "@/components/forms/herramienta-prestamo-form";
import type { Dispatch, SetStateAction } from "react";

type Props = {
    herramienta?: any;
    open: boolean;
    onClose: () => void;
};

export function HerramientaPrestarDialog({ herramienta, open, onClose }: Props) {
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
                    <DialogTitle>Prestar herramienta</DialogTitle>
                    {herramienta && (
                        <DialogDescription>
                            {herramienta.nombre} — Stock disponible: {Number(herramienta.stock ?? 0) - Number(herramienta.prestadas ?? 0)} {herramienta.unidadMedida}
                        </DialogDescription>
                    )}
                </DialogHeader>
                <HerramientaPrestamoForm herramienta={herramienta} setOpen={setOpen} />
            </DialogContent>
        </Dialog>
    );
}
