"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ContratoMarco } from "@/types";

type TalonarioDialogProps = {
  open: boolean;
  setOpen: (v: boolean) => void;
  data: ContratoMarco;
};

export const TalonarioDialog = ({
  open,
  setOpen,
  data,
}: TalonarioDialogProps) => {
  const router = useRouter();
  const [mode, setMode] = useState<"crear" | "actualizar" | null>(null);
  const [porcentaje, setPorcentaje] = useState("");
  const talonarioActual = data.talonarios?.find((e) => e.fechaFin === null);

  const handleConfirm = async () => {
    if (!data.id) return;

    if (mode === "crear") {
      router.push(`/contratos-marco/${data.id}/crear`);
    }

    if (mode === "actualizar") {
      router.push(
        `/contratos-marco/${data.id}/${talonarioActual?.id}?porcentaje=${porcentaje}`
      );
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Qué acción querés realizar?</DialogTitle>
          <DialogDescription>
            Podés crear un nuevo talonario o actualizar el existente con un
            porcentaje.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <Button
              variant={mode === "crear" ? "default" : "outline"}
              onClick={() => setMode("crear")}
            >
              Crear talonario
            </Button>
            <Button
              variant={mode === "actualizar" ? "default" : "outline"}
              onClick={() => setMode("actualizar")}
              disabled={!talonarioActual}
            >
              Actualizar existente
            </Button>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm">Porcentaje de actualización (%)</label>
            <Input
              type="number"
              value={porcentaje}
              disabled={mode !== "actualizar"}
              onChange={(e) => setPorcentaje(e.target.value)}
              placeholder="Ej: 10"
            />
          </div>
          {mode && (
            <Button onClick={handleConfirm}>
              {mode === "crear" ? "Confirmar" : "Confirmar actualización"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
