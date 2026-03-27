import AlquilerPrecioForm from '@/components/forms/alquiler-precio-form'
import { Dispatch, SetStateAction } from 'react';
import {
    DialogContent,
    DialogDescription,
    DialogHeader,
    Dialog,
    DialogTitle,

} from '@/components/ui/dialog'
import { useGetAlquilerPrecioByIdQuery } from '@/hooks/alquiler-precio'

type AlquileresPrecioDialogProps = {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    id: number;
};

export const AlquileresPrecioDialog = ({ open, setOpen, id }: AlquileresPrecioDialogProps) => {
    const { data, isLoading, isFetching } = useGetAlquilerPrecioByIdQuery(id)
    if (isLoading || isFetching) return "Cargando..."
    return (
        <Dialog open={open} onOpenChange={setOpen} modal={true}>
            <DialogContent  >
                <DialogHeader>
                    <DialogTitle>Editar Precio</DialogTitle>
                    <DialogDescription>
                    </DialogDescription>
                </DialogHeader>
                <AlquilerPrecioForm data={data} setOpen={setOpen} />
            </DialogContent>
        </Dialog>
    )
}