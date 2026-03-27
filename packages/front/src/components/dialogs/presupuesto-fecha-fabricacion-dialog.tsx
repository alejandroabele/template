import PresupuestoFechaFabricacionForm from "@/components/forms/presupuesto-fecha-fabricacion-form";
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

type PresupuestoFechaFabricacionDialogProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  id: number;
};

export const PresupuestoFechaFabricacionDialog = ({
  open,
  setOpen,
  id,
}: PresupuestoFechaFabricacionDialogProps) => {
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
          <DialogTitle>Fecha Fabricacion</DialogTitle>
          <DialogDescription>
            Registre la fecha de Fabricacion comprometida con el equipo #{id}
          </DialogDescription>
        </DialogHeader>
        <PresupuestoFechaFabricacionForm data={data} setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
};
