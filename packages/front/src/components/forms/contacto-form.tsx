"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Contacto } from "@/types";
import {
  useCreateContactoMutation,
  useEditContactoMutation,
} from "@/hooks/contacto";
import { useToast } from "@/hooks/use-toast";
import { LoadingButton } from "@/components/ui/loading-button";
import { ContactoTipoSelector } from "@/components/selectors/contacto-tipo-selector";
import { useStore as useGlobalStore } from "@/lib/store";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import { getTodayDateTime, formatTime } from "@/utils/date";

const formSchema = z.object({
  id: z.number().optional(),
  casoId: z.number(),
  tipoId: z.number({ message: "Requerido" }),
  tipo: z.unknown().optional(),
  fecha: z.string().optional(),
  descripcion: z.string().optional(),
  resultado: z.string().optional(),
  vendedorId: z.number().optional(),
});

type ContactoFormProps = {
  data?: Contacto;
  casoId: number;
  onSuccess?: () => void;
  showActions?: boolean;
};

const ContactoForm = ({
  data,
  casoId,
  onSuccess,
  showActions = true,
}: ContactoFormProps) => {
  const { toast } = useToast();
  const user = useGlobalStore((state) => state.user);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: data?.id,
      casoId: casoId,
      tipoId: data?.tipoId,
      tipo: data?.tipo || null,
      fecha: data?.fecha || getTodayDateTime(),
      descripcion: data?.descripcion || "",
      resultado: data?.resultado || "",
      vendedorId: data?.vendedorId,
    },
  });

  const { mutateAsync: create, isPending: isPendingCreate } =
    useCreateContactoMutation();
  const { mutateAsync: edit, isPending: isPendingEdit } =
    useEditContactoMutation();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const payload = {
        casoId: values.casoId,
        tipoId: values.tipoId,
        descripcion: values.descripcion,
        resultado: values.resultado,
        fecha: values.fecha || getTodayDateTime(),
      };

      if (values.id) {
        await edit({ id: values.id, data: payload });
      } else {
        payload.vendedorId = user?.userId;
        await create(payload);
      }

      toast({
        description: "Contacto registrado exitosamente",
        variant: "default",
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Form submission error", error);
      toast({
        description: "Error al registrar el contacto",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form
        id="contacto-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 mx-auto"
      >
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="fecha"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-lg font-semibold">
                  📅 ¿Cuándo fue el contacto?
                </FormLabel>
                <FormControl>
                  <DateTimePicker
                    value={field.value}
                    onChange={field.onChange}
                    allowPast
                  />
                </FormControl>
                <FormDescription className="text-base">
                  Elegí la fecha y hora en que hablaste con el cliente
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tipoId"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-lg font-semibold">
                  📞 ¿Cómo fue el contacto?{" "}
                  <span className="text-red-500">*</span>
                </FormLabel>
                <ContactoTipoSelector
                  contactoTipo={form.watch("tipo")}
                  onChange={(tipo) => {
                    field.onChange(tipo.id!);
                    form.setValue("tipo", tipo);
                  }}
                />
                <FormDescription className="text-base">
                  Por ejemplo: llamada, WhatsApp, email, visita, etc.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className=" space-y-6">
          <FormField
            control={form.control}
            name="descripcion"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-lg font-semibold">
                  💬 ¿De qué hablaron?
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Ejemplo: Hablamos sobre el presupuesto del proyecto X, le expliqué los detalles del servicio..."
                    className="resize-none min-h-[120px] text-base"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-base">
                  Contá brevemente qué temas tocaron en la conversación
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="resultado"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-lg font-semibold">
                  ✅ ¿Qué pasó al final?
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Ejemplo: El cliente está interesado y va a pensar, le envié la propuesta por email..."
                    className="resize-none min-h-[120px] text-base"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-base">
                  ¿Cómo terminó la conversación? ¿Qué se acordó?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {showActions && (
          <div className="flex gap-2">
            <LoadingButton
              loading={isPendingCreate || isPendingEdit}
              type="submit"
            >
              Registrar
            </LoadingButton>
          </div>
        )}
      </form>
    </Form>
  );
};

export default ContactoForm;
