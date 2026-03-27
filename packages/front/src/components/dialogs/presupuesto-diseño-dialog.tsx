import PresupuestoDiseñoForm from '@/components/forms/presupuesto-diseño-form'
import { Dispatch, SetStateAction } from 'react';
import {
    DialogContent,
    DialogDescription,
    DialogHeader,
    Dialog,
    DialogTitle,

} from '@/components/ui/dialog'
import { useGetPresupuestoByIdQuery } from '@/hooks/presupuestos'

type PresupuestoDiseñoDialogProps = {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    id: number;
};

export const PresupuestoDiseñoDialog = ({ open, setOpen, id }: PresupuestoDiseñoDialogProps) => {
    const { data, isLoading, isFetching } = useGetPresupuestoByIdQuery(id)
    if (isLoading || isFetching) return "Cargando..."
    return (
        <Dialog open={open} onOpenChange={setOpen} modal={true}>
            <DialogContent  >
                <DialogHeader>
                    <DialogTitle>Editar diseño</DialogTitle>
                    <DialogDescription>
                    </DialogDescription>
                </DialogHeader>
                <PresupuestoDiseñoForm data={data} setOpen={setOpen} />
            </DialogContent>
        </Dialog>
    )
}