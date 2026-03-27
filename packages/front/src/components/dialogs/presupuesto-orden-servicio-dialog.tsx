import PresupuestoOrdenServicioForm from "@/components/forms/presupuesto-orden-servicio-form";
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

type PresupuestoOrdenServicioDialogProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  id: number;
};

export const PresupuestoOrdenServicioDialog = ({
  open,
  setOpen,
  id,
}: PresupuestoOrdenServicioDialogProps) => {
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
          <DialogTitle>Verificación de Orden de Servicio</DialogTitle>
          <DialogDescription>
            Registre la fecha de verificación para el presupuesto #{id}
          </DialogDescription>
        </DialogHeader>
        <PresupuestoOrdenServicioForm data={data} setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
};
