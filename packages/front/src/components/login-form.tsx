import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { useToast } from "@/hooks/use-toast";
import fetchClient from "@/lib/api-client";
import { formSchema } from "@/lib/schema-login";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Toaster } from "./ui/toaster";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const result = await fetchClient<{
        success?: boolean;
        message?: string;
        data?: { authToken: string; sessionToken: string };
        password: string;
        email: string;
      }>("auth/login", "POST", values);
      if (result?.success && result?.data?.authToken) {
        sessionStorage.setItem("tokenAuth", result?.data?.authToken);
        localStorage.setItem("session-token", result?.data?.sessionToken);
        router.push("/");
      } else {
        toast({
          title: "Error",
          description: result.message,
        });
      }
    } catch (error: any) {
      if (error?.status === 400) {
        toast({
          title: "Credenciales inválidas",
          description: "Revisá tu usuario y contraseña e intentá nuevamente.",
        });
      } else if (error?.status === 423) {
        toast({
          title: "⚠️ Usuario bloqueado",
          description:
            "Superaste el número de intentos permitidos, o el usuario esta inactivo.  Contactá al administrador.",
          variant: "destructive",
        });
      }

      console.error("Ocurrio un error", error);
    }
    setLoading(false);
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">
                    {process.env.NEXT_PUBLIC_APP_NAME}
                  </h1>
                  <p className="text-balance text-muted-foreground">
                    Ingrese sesión con su cuenta
                  </p>
                </div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="email">Usuario</FormLabel>
                      <FormControl>
                        <Input
                          id="email"
                          placeholder="mi@mail.com"
                          type="email"
                          autoComplete="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <div className="flex justify-between items-center">
                        <FormLabel htmlFor="password">Contraseña</FormLabel>
                        <Link
                          href="#"
                          className="ml-auto inline-block text-sm underline"
                        >
                          Olvidaste tu contraseña?
                        </Link>
                      </div>
                      <FormControl>
                        <PasswordInput
                          id="password"
                          placeholder="******"
                          autoComplete="current-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="animate-spin" />}
                  Iniciar sesión
                </Button>
              </div>
            </form>
          </Form>
          <div className="relative hidden bg-muted md:block">
            <Image
              src="/placeholder.svg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
              width={100}
              height={100}
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        Bienvenido al CRM de {process.env.NEXT_PUBLIC_APP_NAME || "Pintegralco"}
        , la herramienta interna diseñada para gestionar y dar seguimiento a
        trabajos y presupuestos de manera eficiente.
      </div>
      <Toaster />
    </div>
  );
}
