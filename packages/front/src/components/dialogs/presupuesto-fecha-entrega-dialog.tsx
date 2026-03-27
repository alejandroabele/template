import PresupuestoFechaEntregaForm from "@/components/forms/presupuesto-fecha-entrega-form"
import type { Dispatch, SetStateAction } from "react"
import { DialogContent, DialogDescription, DialogHeader, Dialog, DialogTitle } from "@/components/ui/dialog"
import { useGetPresupuestoByIdQuery } from "@/hooks/presupuestos"
import { Loading } from "@/components/loading"

type PresupuestoFechaEntregaDialogProps = {
    open: boolean
    setOpen: Dispatch<SetStateAction<boolean>>
    id: number
}

export const PresupuestoFechaEntregaDialog = ({ open, setOpen, id }: PresupuestoFechaEntregaDialogProps) => {
    const { data, isLoading, isFetching } = useGetPresupuestoByIdQuery(id)
    if (isLoading || isFetching) return <Loading />

    return (
        <Dialog open={open} onOpenChange={setOpen} modal={true} >
            <DialogContent className="sm:max-w-md pointer-events-auto"
                onInteractOutside={(e) => {
                    e.preventDefault();
                }}>
                <DialogHeader>
                    <DialogTitle>Fecha entrega</DialogTitle>
                    <DialogDescription>Registre la fecha de entrega comprometida con el cliente #{id}</DialogDescription>
                </DialogHeader>
                <PresupuestoFechaEntregaForm data={data} setOpen={setOpen} />
            </DialogContent>
        </Dialog>
    )
}
