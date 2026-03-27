import {
    DialogContent,
    DialogDescription,
    DialogHeader,
    Dialog,
    DialogTitle,
} from '@/components/ui/dialog'
import AlquilerPresupuestoForm from '@/components/forms/alquiler-presupuesto-form'
import { Dispatch, SetStateAction } from 'react';
import { Alquiler } from '@/types';

type AlquilerPresupuestoDialogProps = {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    id?: number;
    data: Alquiler
};

export const AlquilerPresupuestoDialog = ({ open, setOpen, id, data }: AlquilerPresupuestoDialogProps) => {


    return (
        <Dialog open={open} onOpenChange={setOpen} modal={true}>
            <DialogContent >
                <DialogHeader>
                    <DialogTitle>Presupuesto de Mantenimiento</DialogTitle>
                    <DialogDescription>
                        Complete la información necesaria para generar el presupuesto de mantenimiento
                    </DialogDescription>
                </DialogHeader>
                <AlquilerPresupuestoForm data={data} setOpen={setOpen} />
            </DialogContent>
        </Dialog>
    )
}