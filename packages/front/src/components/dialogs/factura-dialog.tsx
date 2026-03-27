"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import FacturaForm from "@/components/forms/factura-form";
import { useGetFacturaByIdQuery } from "@/hooks/factura";
import type { Dispatch, SetStateAction } from "react";

type FacturaDialogProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  id?: number;
  modelo: "presupuesto" | "alquiler";
  modeloId: number;
  monto?: string;
  clienteId?: number;
  cliente?: any;
};

export const FacturaDialog = ({
  open,
  setOpen,
  id,
  modelo,
  modeloId,
  monto,
  clienteId,
  cliente,
}: FacturaDialogProps) => {
  const { data, isLoading, isFetching } = useGetFacturaByIdQuery(id!);

  if (isLoading || isFetching) return;
  console.log({ data, cliente, clienteId });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="min-w-[50vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle></DialogTitle>
        </DialogHeader>
        <FacturaForm
          data={data}
          setOpen={setOpen}
          modelo={modelo}
          modeloId={modeloId}
          defaultMonto={monto}
          defaultClienteId={clienteId}
          defaultCliente={cliente}
        />
      </DialogContent>
    </Dialog>
  );
};
