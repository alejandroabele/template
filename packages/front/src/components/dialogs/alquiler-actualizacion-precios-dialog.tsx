"use client"

import React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import type { Alquiler } from "@/types"
import AlquilerActualizacionPreciosForm from "@/components/forms/alquiler-actualizacion-precios-form"

type AlquilerActualizacionPreciosDialogProps = {
    open: boolean
    setOpen: (open: boolean) => void
    selectedRows: Alquiler[]
}

export const AlquilerActualizacionPreciosDialog = ({
    open,
    setOpen,
    selectedRows,
}: AlquilerActualizacionPreciosDialogProps) => {
    const { toast } = useToast()

    const handleClose = () => {
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[700px] max-h-[80vh]">
                <DialogHeader>
                    <DialogTitle>Actualizar Precios</DialogTitle>
                    <DialogDescription>
                        Aplicar índices seleccionados a {selectedRows?.length} alquileres
                    </DialogDescription>
                </DialogHeader>

                <AlquilerActualizacionPreciosForm
                    selectedRows={selectedRows}
                    setOpen={setOpen}
                    toast={toast}
                />
            </DialogContent>
        </Dialog>
    )
}