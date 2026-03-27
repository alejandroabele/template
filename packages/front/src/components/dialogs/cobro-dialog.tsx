"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CobroForm from "@/components/forms/cobro-form";
import { useGetCobroByIdQuery } from "@/hooks/cobro";
import type { Dispatch, SetStateAction } from "react";

type CobroDialogProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  id?: number;
  modelo: "presupuesto" | "alquiler";
  modeloId: number;
  monto?: number;
  clienteId?: number;
  cliente?: any;
};

export const CobroDialog = ({
  open,
  setOpen,
  id,
  modelo,
  modeloId,
  monto,
}: CobroDialogProps) => {
  const { data, isLoading, isFetching } = useGetCobroByIdQuery(id!);
  if (isLoading || isFetching) return;
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="min-w-[50vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle></DialogTitle>
        </DialogHeader>
        <CobroForm
          data={data}
          setOpen={setOpen}
          modelo={modelo}
          modeloId={modeloId}
          defaultMonto={monto?.toString() || ""}
        />
      </DialogContent>
    </Dialog>
  );
};
