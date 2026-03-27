"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ContratoMarco } from "@/types";

type ContratoMarcoPresupuestoDialogProps = {
  open: boolean;
  setOpen: (v: boolean) => void;
  data: ContratoMarco;
};

export const ContratoMarcoPresupuestoDialog = ({
  open,
  setOpen,
  data,
}: ContratoMarcoPresupuestoDialogProps) => {
  const router = useRouter();

  const handleClick = (tipo: "servicio" | "producto") => {
    if (!data.id) return;
    router.push(
      `/contratos-marco-presupuesto/crear?contratoMarcoId=${data.id}&tipo=${tipo}`
    );
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear orden</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Button onClick={() => handleClick("servicio")}>Servicio</Button>
          <Button onClick={() => handleClick("producto")}>Producto</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
