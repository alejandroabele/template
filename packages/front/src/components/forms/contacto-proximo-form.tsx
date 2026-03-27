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
import { DateTimePicker } from "@/components/ui/datetime-picker";
import { ContactoTipoSelector } from "@/components/selectors/contacto-tipo-selector";
import { LoadingButton } from "@/components/ui/loading-button";

const formSchema = z.object({
  proximaFecha: z.string().min(1, "La fecha es requerida"),
  proximoTipoId: z.number({ message: "El tipo es requerido" }),
  proximoTipo: z.unknown().optional(),
  proximaNota: z.string().optional(),
});

type ContactoProximoFormProps = {
  onSubmit?: (values: z.infer<typeof formSchema>) => void | Promise<void>;
  defaultValues?: Partial<z.infer<typeof formSchema>>;
  showActions?: boolean;
  isLoading?: boolean;
};

const ContactoProximoForm = ({
  onSubmit,
  defaultValues,
  showActions = true,
  isLoading = false
}: ContactoProximoFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      proximaFecha: defaultValues?.proximaFecha || "",
      proximoTipoId: defaultValues?.proximoTipoId,
      proximoTipo: defaultValues?.proximoTipo || null,
      proximaNota: defaultValues?.proximaNota || "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    if (onSubmit) {
      await onSubmit(values);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-8"
        id="contacto-proximo-form"
      >
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="proximaFecha"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-lg font-semibold">
                  📅 ¿Cuándo querés volver a contactarlo? <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <DateTimePicker
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormDescription className="text-base">
                  Elegí la fecha y hora del próximo contacto con este cliente
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="proximoTipo"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-lg font-semibold">
                  📞 ¿Cómo vas a contactarlo? <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <ContactoTipoSelector
                    contactoTipo={field.value}
                    onChange={(tipo) => {
                      form.setValue("proximoTipoId", tipo.id!);
                      form.setValue("proximoTipo", tipo);
                    }}
                  />
                </FormControl>
                <FormDescription className="text-base">
                  Por ejemplo: llamada, WhatsApp, email, visita, etc.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="border-t pt-6">
          <FormField
            control={form.control}
            name="proximaNota"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-lg font-semibold">
                  📝 Recordatorio (opcional)
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Ejemplo: Enviarle la propuesta actualizada, preguntarle si ya decidió, recordarle la reunión..."
                    className="resize-none min-h-[120px] text-base"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-base">
                  Anotá acá qué tenés que hacer cuando llegue el momento de contactarlo
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {showActions && (
          <div className="flex gap-2">
            <LoadingButton loading={isLoading} type="submit">
              Registrar Próximo Contacto
            </LoadingButton>
          </div>
        )}
      </form>
    </Form>
  );
};

export default ContactoProximoForm;
