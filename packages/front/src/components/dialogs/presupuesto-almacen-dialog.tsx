import PresupuestoAlmacenForm from "@/components/forms/presupuesto-almacen-form";
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

type PresupuestoAlmacenDialogProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  id: number;
};

export const PresupuestoAlmacenDialog = ({
  open,
  setOpen,
  id,
}: PresupuestoAlmacenDialogProps) => {
  const { data, isLoading, isFetching } = useGetPresupuestoByIdQuery(id);
  if (isLoading || isFetching) return <Loading />;

  return (
    <Dialog open={open} onOpenChange={setOpen} modal={true}>
      <DialogContent
        className=" pointer-events-auto"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Verificación de Almacén</DialogTitle>
          <DialogDescription>
            Registre la fecha de verificación para el presupuesto #{id}
          </DialogDescription>
        </DialogHeader>
        <PresupuestoAlmacenForm data={data} setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
};
