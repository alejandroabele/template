import Form from "@/components/forms/movimiento-inventario-form"
import type { Dispatch, SetStateAction } from "react"
import { DialogContent, DialogDescription, DialogHeader, Dialog, DialogTitle } from "@/components/ui/dialog"
import { useGetInventarioByIdQuery } from "@/hooks/inventario"
import { Loading } from "@/components/loading"

type MovimientoInventarioDialogProps = {
    open: boolean
    setOpen: Dispatch<SetStateAction<boolean>>
    id: number
}

export const MovimientoInventarioDialog = ({ open, setOpen, id }: MovimientoInventarioDialogProps) => {
    const { data, isLoading, isFetching } = useGetInventarioByIdQuery(id)
    if (isLoading || isFetching) return <Loading />
    return (
        <Dialog open={open} onOpenChange={setOpen} modal={true} >
            <DialogContent className="sm:max-w-md pointer-events-auto"
                onInteractOutside={(e) => {
                    e.preventDefault();
                }}>
                <DialogHeader>
                    <DialogTitle>Movimiento de Stock
                    </DialogTitle>
                    <DialogDescription>
                        Registrar movimiento para: {data?.nombre}
                        <br />
                        Stock actual: {data?.stock} {data?.unidadMedida}

                    </DialogDescription>
                </DialogHeader>
                <Form data={data} setOpen={setOpen} />
            </DialogContent>
        </Dialog>
    )
}
