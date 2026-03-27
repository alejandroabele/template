import {
    DialogContent,
    DialogDescription,
    DialogHeader,
    Dialog,
    DialogTitle,
} from '@/components/ui/dialog'
import AlquilerMantenimientoForm from '@/components/forms/alquiler-mantenimiento-form'
import { Dispatch, SetStateAction } from 'react';
import { useGetAlquilerMantenimientoByIdQuery } from '@/hooks/alquiler-mantenimiento'

type AlquilerMantenimientoDialogProps = {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    id?: number;
    alquilerRecursoId?: number;
};

export const AlquilerMantenimientoDialog = ({ open, setOpen, id, alquilerRecursoId }: AlquilerMantenimientoDialogProps) => {
    const { data, isLoading, isFetching } = useGetAlquilerMantenimientoByIdQuery(id)
    if (isLoading || isFetching) return "Cargando..."

    const filteredData = Object.fromEntries(
        Object.entries({ alquilerRecursoId }).filter(([_, value]) => value !== undefined)
    );
    return (
        <Dialog open={open} onOpenChange={setOpen} modal={true}>
            <DialogContent  >
                <DialogHeader>
                    <DialogTitle>{id ? 'Editar mantenimiento' : 'Crear mantenimiento'}</DialogTitle>
                    <DialogDescription>
                    </DialogDescription>
                </DialogHeader>
                <AlquilerMantenimientoForm data={{ ...data, ...filteredData }} setOpen={setOpen} />
            </DialogContent>
        </Dialog>
    )
}