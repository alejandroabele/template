import PresupuestoCertificacionForm from "@/components/forms/presupuesto-certificacion-form";
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

type PresupuestoCertificacionDialogProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  id: number;
};

export const PresupuestoCertificacionDialog = ({
  open,
  setOpen,
  id,
}: PresupuestoCertificacionDialogProps) => {
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
          <DialogTitle>Certificación</DialogTitle>
          <DialogDescription>Ingrese la certificación</DialogDescription>
        </DialogHeader>
        <PresupuestoCertificacionForm data={data} setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
};
