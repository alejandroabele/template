import PresupuestoConfirmarEntregaForm from "@/components/forms/presupuesto-confirmar-entrega-form";
import type { Dispatch, SetStateAction } from "react";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  Dialog,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGetPresupuestoByIdQuery } from "@/hooks/presupuestos";
import { Loading } from "@/components/loading";

type PresupuestoConfirmarEntregaDialogProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  id: number;
};

export const PresupuestoConfirmarEntregaDialog = ({
  open,
  setOpen,
  id,
}: PresupuestoConfirmarEntregaDialogProps) => {
  const { data, isLoading, isFetching } = useGetPresupuestoByIdQuery(id);
  if (isLoading || isFetching) return <Loading />;

  return (
    <Dialog open={open} onOpenChange={setOpen} modal={true}>
      <DialogContent
        className="sm:max-w-md pointer-events-auto"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Fecha entrega</DialogTitle>
          <DialogDescription>
            Registre la fecha en la que se entrego el trabajo
          </DialogDescription>
        </DialogHeader>
        <PresupuestoConfirmarEntregaForm data={data} setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
};
