"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { InputMoney } from "@/components/input-money";
import { BancoSelector } from "@/components/selectors/banco-selector";
import { useTransferirBancoMutation } from "@/hooks/banco";
import { toast } from "sonner";
import type { Banco } from "@/types";

interface TransferenciaBancoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bancoOrigen?: Banco;
}

export function TransferenciaBancoModal({
  open,
  onOpenChange,
  bancoOrigen,
}: TransferenciaBancoModalProps) {
  const [bancoDestino, setBancoDestino] = React.useState<Banco | undefined>(undefined);
  const [monto, setMonto] = React.useState<string>("");
  const transferirMutation = useTransferirBancoMutation();

  // Limpiar formulario cuando se cierra el modal
  React.useEffect(() => {
    if (!open) {
      setBancoDestino(undefined);
      setMonto("");
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!bancoOrigen) {
      toast.error("Debe seleccionar un banco de origen");
      return;
    }

    if (!bancoDestino) {
      toast.error("Debe seleccionar un banco de destino");
      return;
    }

    if (!monto || parseFloat(monto) <= 0) {
      toast.error("El monto debe ser mayor a cero");
      return;
    }

    if (bancoOrigen.id === bancoDestino.id) {
      toast.error("No puede transferir al mismo banco");
      return;
    }

    try {
      const result = await transferirMutation.mutateAsync({
        bancoOrigenId: bancoOrigen.id!,
        bancoDestinoId: bancoDestino.id!,
        monto: parseFloat(monto),
      });

      toast.success("Transferencia realizada exitosamente");

      // Limpiar formulario y cerrar modal
      setBancoDestino(undefined);
      setMonto("");
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.message || "Error al realizar la transferencia");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Transferir entre cuentas</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Banco origen</Label>
            <Input
              value={bancoOrigen?.nombre || ""}
              disabled
              className="bg-muted"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bancoDestino">Banco destino</Label>
            <BancoSelector
              value={bancoDestino}
              onChange={setBancoDestino}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="monto">Monto</Label>
            <InputMoney
              value={monto}
              onChange={setMonto}
              placeholder="0,00"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={transferirMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={transferirMutation.isPending}
            >
              {transferirMutation.isPending ? "Transfiriendo..." : "Transferir"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
