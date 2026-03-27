"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ArchivosInput } from "@/components/form-helpers/archivos-input";
import { Alquiler, AlquilerRecurso, Cliente } from "@/types";
import { InputMoney } from "@/components/input-money";
import { format } from "date-fns";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import {
  useCreateAlquilerMutation,
  useEditAlquilerMutation,
  useEditPrecioAlquilerMutation,
} from "@/hooks/alquiler";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation"; // Usage: App router
import { ALQUILER_ESTADO, ALQUILER_TIPO } from "@/constants/alquiler";
import { Textarea } from "@/components/ui/textarea";
import { ClienteSelector } from "@/components/selectors/cliente-selector";
import { AlquilerRecursoSelector } from "@/components/selectors/alquiler-recurso-selector";
import { DatePicker } from "@/components/form-helpers/date-picker";
import { IndiceSelector } from "@/components/selectors/indice-selector";
import { Indice } from "@/types";
import { useGetAlquilerByIdQuery } from "@/hooks/alquiler";
import { FacturaDialog } from "@/components/dialogs/factura-dialog";
import { CobroDialog } from "@/components/dialogs/cobro-dialog";
import { NuevaOtMantenimientoDialog } from "@/components/dialogs/nueva-ot-mantenimiento-dialog";
import { useFileUploadHandler } from "@/hooks/file-upload";
import { useStore } from "@/components/tables/alquileres-table/store";
import { LoadingButton } from "@/components/ui/loading-button";
import { PERMISOS } from "@/constants/permisos";
import { hasPermission } from "@/hooks/use-access";
import { formatDate } from "@/utils/date";
import { PeriodicidadActualizacion } from "../selectors/periodicidad-actualizacion-selector";
const formSchema = z
  .object({
    id: z.number().optional(),
    localidad: z.string({ message: "Requerido" }).min(2),
    zona: z.string({ message: "Requerido" }),
    estado: z.string({ message: "Requerido" }).min(2),
    tipo: z.string({ message: "Requerido" }).min(2),
    notas: z.string({ message: "Requerido" }),
    fechaLimiteNegociacion: z.unknown({ message: "Requerido" }),
    inicioContrato: z.unknown({ message: "Requerido" }),
    vencimientoContrato: z.unknown({ message: "Requerido" }),
    precio: z.coerce.number({ message: "Precio requerido" }),
    clienteId: z.unknown({ message: "Precio requerido" }),
    cliente: z.unknown({ message: "Cliente requerido" }).optional(),
    alquilerRecursoId: z.unknown({ message: "Recurso requerido" }),
    alquilerRecurso: z.unknown({ message: "Recurso requerido" }),
    periodicidadActualizacion: z.string({ message: "Requerido" }).optional(),
  })

  .refine(
    (data) => {
      return validateFechas(data); // Llamada a la función validateFechas
    },
    (data) => {
      return {
        message: `Las fechas deben estar comprendidas en el periodo del subalquiler (${formatDate(data.alquilerRecurso?.inicioContratoSubAlquiler)} - ${formatDate(data.alquilerRecurso?.vencimientoContratoSubAlquiler)}.`,
        path: ["inicioContrato"], // Mostrar el error en el campo "inicioContrato"
      };
    }
  );

const validateFechas = (data: any): boolean => {
  if (data.estado !== "ARRENDADO") return true;

  const convertirFecha = (fecha: unknown): Date | null =>
    fecha ? new Date(fecha as string) : null;

  const inicioContrato = convertirFecha(data.inicioContrato);
  const vencimientoContrato = convertirFecha(data.vencimientoContrato);
  const inicioSubAlquiler = convertirFecha(
    data.alquilerRecurso?.inicioContratoSubAlquiler
  );
  const vencimientoSubAlquiler = convertirFecha(
    data.alquilerRecurso?.vencimientoContratoSubAlquiler
  );

  if (!inicioSubAlquiler || !vencimientoSubAlquiler) return true;

  if (inicioContrato) {
    const fechasDentroDelRango =
      inicioContrato < inicioSubAlquiler ||
      inicioContrato > vencimientoSubAlquiler;
    if (fechasDentroDelRango) {
      return false;
    }
  }
  if (vencimientoContrato) {
    const fechasDentroDelRango =
      vencimientoContrato < inicioSubAlquiler ||
      vencimientoContrato > vencimientoSubAlquiler;
    if (fechasDentroDelRango) {
      return false;
    }
  }

  return true;
};

export default function FormContainer({ id }: { id: number }) {
  const setRecursoId = useStore((state) => state.setRecursoId);

  const { data, isLoading, isFetching } = useGetAlquilerByIdQuery(id);
  React.useEffect(() => {
    if (data) {
      setRecursoId(data.alquilerRecursoId);
    }
  }, [data]);
  if (isLoading || isFetching) return "Cargando...";

  return <MyForm data={data} />;
}

type MyFormProps = {
  data?: Alquiler;
};
function MyForm({ data }: MyFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  // const [selectedIndice, setSelectedIndice] = React.useState<Indice>(null);
  // const [indiceError, setIndiceError] = React.useState<string>("");

  const [openFacturacionEdit, setOpenFacturacionEdit] = React.useState(false);
  const [openCobranzaEdit, setOpenCorbranzaEdit] = React.useState(false);
  const [openMantenimientoEdit, setOpenMantenimientoEdit] =
    React.useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: data?.id,
      localidad: data?.localidad || "",
      zona: data?.zona || "",
      estado: data?.estado || "",
      tipo: data?.tipo || "",
      notas: data?.notas || "",
      precio: data?.precio || 0,
      clienteId: data?.clienteId || null,
      fechaLimiteNegociacion: data?.fechaLimiteNegociacion || null,
      inicioContrato: data?.inicioContrato || format(new Date(), "yyyy-MM-dd"),
      cliente: data?.cliente,
      vencimientoContrato: data?.vencimientoContrato || null,
      alquilerRecursoId: data?.alquilerRecursoId || null,
      alquilerRecurso: data?.alquilerRecurso,
      periodicidadActualizacion: data?.periodicidadActualizacion,
    },
  });
  const [contratoPDF, setContratoPDF] = React.useState<File[]>([]);
  const [fichaTecnicaPDF, setFichaTecnicaPDF] = React.useState<File[]>([]);
  const { mutateAsync: create, isPending: isPendingCreate } =
    useCreateAlquilerMutation();
  const { mutateAsync: edit, isPending: isPendingEdit } =
    useEditAlquilerMutation();
  const { mutateAsync: editPrecio } = useEditPrecioAlquilerMutation();
  const { handleFileUpload } = useFileUploadHandler();

  const estado = form.watch("estado");
  const precio = form.watch("precio");
  const id = form.watch("id");

  const uploadFiles = async (id: number) => {
    await handleFileUpload({
      fileId: data?.contratoArchivo?.id,
      fileArray: contratoPDF,
      modelo: "alquiler",
      modeloId: id,
      tipo: "contrato",
    });

    await handleFileUpload({
      fileId: data?.fichaTecnicaArchivo?.id,
      fileArray: fichaTecnicaPDF,
      modelo: "alquiler",
      modeloId: id,
      tipo: "ficha_tecnica",
    });
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    let response;
    try {
      // TODO: Crear servicio para eliminar o crear archivos pero de alquileres
      if (values.id) {
        response = await edit({ id: values.id, data: values });
        await uploadFiles(values.id);
      } else {
        response = await create(values);
        if (response.id) {
          await uploadFiles(response.id);
          router.push("/alquileres/" + response.id);
          form.setValue("id", response.id);
        }
      }

      toast({
        description: "Exito al realizar la operación",
        variant: "default",
      });
    } catch (error) {
      console.error("Form submission error", error);
      toast({
        description: "Error al realizar la operación",
        variant: "destructive",
      });
    }
  }
  //  const validateIndice = () => {
  //      if (!selectedIndice) {
  //          setIndiceError("Debe seleccionar un índice antes de actualizar el precio.");
  //          return false;
  //      }
  //      setIndiceError("");
  //      return true;
  //  };

  const handleUpdatePrecio = () => {
    // if (!validateIndice()) {
    //     return;
    // }

    // const nuevoPrecio = precio * (1 + selectedIndice.porcentaje / 100);
    // form.setValue("precio", parseFloat(nuevoPrecio.toFixed(0)));
    try {
      editPrecio({ id, data: form.getValues() });
    } catch (error) {}
    toast({
      description: `Precio actualizado`,
      variant: "default",
    });
  };
  const handleSelectIndice = (indice: Indice) => {
    // setSelectedIndice(indice);
    // setIndiceError("");

    const nuevoPrecio = precio * (1 + indice.porcentaje / 100);
    form.setValue("precio", parseFloat(nuevoPrecio.toFixed(0)));
  };
  const handleEstadoChange = (newEstado: string) => {
    if (newEstado === "ARRENDADO") {
      form.setValue("fechaLimiteNegociacion", null);
    }
  };

  // TODO: Al crear un nuevo tiene que eliminar el anterior del disco y al borrar y poner guardar tiene borrar el anterior que quedaba

  return (
    <>
      {openFacturacionEdit && data?.id && (
        <FacturaDialog
          open={openFacturacionEdit}
          setOpen={setOpenFacturacionEdit}
          modelo="alquiler"
          modeloId={data.id}
          monto={String(form.getValues("precio") || 0)}
          clienteId={form.getValues("clienteId")}
          cliente={form.getValues("cliente")}
        />
      )}

      {openCobranzaEdit && data?.id && (
        <CobroDialog
          open={openCobranzaEdit}
          setOpen={setOpenCorbranzaEdit}
          monto={form.getValues("precio")}
          modelo="alquiler"
          modeloId={data.id}
        />
      )}

      {openMantenimientoEdit && data?.alquilerRecursoId && (
        <NuevaOtMantenimientoDialog
          open={openMantenimientoEdit}
          setOpen={setOpenMantenimientoEdit}
          alquilerRecursoId={data.alquilerRecursoId}
          codigoRecurso={data.alquilerRecurso?.codigo}
        />
      )}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8  mx-auto py-10"
        >
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-3">
              <FormField
                control={form.control}
                name="alquilerRecursoId"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="pb-2">Código</FormLabel>
                    <AlquilerRecursoSelector
                      value={data?.alquilerRecurso}
                      onChange={(v: AlquilerRecurso) => {
                        form.setValue("alquilerRecursoId", v.id);
                        form.setValue("alquilerRecurso", v);
                        if (v.tipo) form.setValue("tipo", v.tipo);
                        if (v.cartel?.localidad)
                          form.setValue("localidad", v.cartel.localidad);
                        if (v.cartel?.zona) form.setValue("zona", v.cartel.zona);
                        if (v.precio) form.setValue("precio", v.precio);
                      }}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-12 md:col-span-3">
              <FormField
                control={form.control}
                name="localidad"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Localidad</FormLabel>
                    <FormControl>
                      <Input placeholder="" type="text" {...field} />
                    </FormControl>
                    <FormDescription>
                      Este es el nombre del area
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-12 md:col-span-3">
              <FormField
                control={form.control}
                name="zona"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Zona</FormLabel>
                    <FormControl>
                      <Input placeholder="" type="text" {...field} />
                    </FormControl>
                    <FormDescription>
                      Este es el nombre del area
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-12 md:col-span-3">
              <FormField
                control={form.control}
                name="periodicidadActualizacion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Periodicidad Actualización</FormLabel>
                    <PeriodicidadActualizacion
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-12 md:col-span-3">
              <FormField
                control={form.control}
                name="precio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio</FormLabel>
                    <FormControl>
                      <InputMoney {...field} />
                    </FormControl>
                    <FormDescription>
                      Precio de alquiler mensual $
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-12 md:col-span-3">
              <FormItem className="flex flex-col">
                <FormLabel className="pb-2">Indice</FormLabel>
                <IndiceSelector
                  // indice={selectedIndice}
                  onChange={handleSelectIndice}
                />
                <FormDescription>
                  Indice utilizado para actualizar el precio
                </FormDescription>
                {/* {indiceError && (
                                    <p className="text-red-500 text-sm">{indiceError}</p>
                                )} */}
              </FormItem>
            </div>

            <div className="col-span-12 md:col-span-3">
              <FormField
                control={form.control}
                name="estado"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        handleEstadoChange(value); // Llamar a la función para manejar el cambio
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar estado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ALQUILER_ESTADO.map((e) => (
                          <SelectItem key={e} value={e}>
                            {e}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Estado del rental.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-12 md:col-span-3">
              <DatePicker
                label="Fecha Limite Negociación"
                form={form}
                disabled={estado !== "EN_NEGOCIACION"}
                name="fechaLimiteNegociacion"
                fromYear={2025}
              />
            </div>
            <div className="col-span-12 md:col-span-3">
              <DatePicker
                label="Inicio de contrato"
                form={form}
                name="inicioContrato"
                fromYear={2020}
              />
            </div>
            <div className="col-span-12 md:col-span-3">
              <DatePicker
                label="Vencimiento de contrato"
                form={form}
                name="vencimientoContrato"
                fromYear={2025}
              />
            </div>

            <div className="col-span-12 md:col-span-3">
              <FormField
                control={form.control}
                name="clienteId"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="pb-2">Cliente</FormLabel>
                    <ClienteSelector
                      value={data?.cliente}
                      onChange={(v: Cliente) => {
                        form.setValue("clienteId", v.id);
                        form.setValue("cliente", v);
                      }}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-12 md:col-span-3">
              <FormField
                control={form.control}
                name="tipo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ALQUILER_TIPO.map((e) => (
                          <SelectItem key={e} value={e}>
                            {e}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Estado del rental.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-12 md:col-span-3">
              <ArchivosInput
                label="Contrato"
                value={contratoPDF}
                setValue={setContratoPDF}
                defaultValue={data?.contratoArchivo}
              />
            </div>

            <div className="col-span-12 md:col-span-3">
              <ArchivosInput
                label="Ficha Técnica"
                value={fichaTecnicaPDF}
                setValue={setFichaTecnicaPDF}
                defaultValue={data?.fichaTecnicaArchivo}
              />
            </div>
            <div className="col-span-12 md:col-span-6">
              <FormField
                control={form.control}
                name="notas"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notas</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder=""
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Podes usar este espacio para almacenar informacion
                      adicional de los alquileres
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <LoadingButton
              loading={isPendingCreate || isPendingEdit}
              type="submit"
            >
              Guardar
            </LoadingButton>
            {hasPermission(PERMISOS.ALQUILERES_PRECIO_CREAR) && (
              <Button
                type="button"
                variant={"secondary"}
                disabled={!id}
                onClick={handleUpdatePrecio}
              >
                Actualizar Precio
              </Button>
            )}
            {hasPermission(PERMISOS.ALQUILERES_FACTURAS_CREAR) && (
              <Button
                type="button"
                variant={"secondary"}
                disabled={!id}
                onClick={() => setOpenFacturacionEdit(true)}
              >
                Cargar Factura
              </Button>
            )}
            {hasPermission(PERMISOS.ALQUILERES_COBRANZAS_CREAR) && (
              <Button
                type="button"
                variant={"secondary"}
                disabled={!id}
                onClick={() => setOpenCorbranzaEdit(true)}
              >
                Cargar Cobro
              </Button>
            )}
            {hasPermission(PERMISOS.ALQUILERES_MANTENIMIENTO_CREAR) && (
              <Button
                type="button"
                variant={"secondary"}
                disabled={!id || !data?.alquilerRecursoId}
                onClick={() => setOpenMantenimientoEdit(true)}
              >
                Nueva OT de Mantenimiento
              </Button>
            )}
            <Button
              type="button"
              onClick={() => router.back()}
              variant={"link"}
            >
              Volver
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
