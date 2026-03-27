import InventarioConversionForm from "@/components/forms/inventario-conversion-form"
import type { Dispatch, SetStateAction } from "react"
import { DialogContent, DialogDescription, DialogHeader, Dialog, DialogTitle } from "@/components/ui/dialog"
import { useGetInventarioConversionByIdQuery } from "@/hooks/inventario-conversion"
import { Loading } from "@/components/loading"
import { Inventario } from "@/types"

type InventarioConversionDialogProps = {
    open: boolean
    setOpen: Dispatch<SetStateAction<boolean>>
    id?: number
    inventario?: Inventario
}

export const InventarioConversionDialog = ({ open, setOpen, id, inventario }: InventarioConversionDialogProps) => {
    const { data, isLoading, isFetching } = useGetInventarioConversionByIdQuery(id)
    if (isLoading || isFetching) return <Loading />



    return (
        <Dialog open={open} onOpenChange={setOpen} modal={true} >
            <DialogContent className="sm:max-w-md pointer-events-auto"
                onInteractOutside={(e) => {
                    e.preventDefault();
                }}>
                <DialogHeader>
                    <DialogTitle>Conversión de unidad</DialogTitle>
                    <DialogDescription>Modifica los datos de conversión entre unidades para el producto seleccionado</DialogDescription>
                </DialogHeader>
                <InventarioConversionForm data={{
                    inventario,
                    ...data,
                }}
                    setOpen={setOpen}
                />
            </DialogContent>
        </Dialog>
    )
}
