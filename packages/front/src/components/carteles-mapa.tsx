"use client"
import dynamic from "next/dynamic"
import { AlquilerRecurso } from "@/types"

const CartelesMapa = dynamic(
    () => import("@/components/carteles-mapa-inner"),
    {
        ssr: false,
        loading: () => (
            <div className="h-[500px] w-full bg-muted rounded-lg animate-pulse flex items-center justify-center text-muted-foreground text-sm">
                Cargando mapa...
            </div>
        ),
    }
)

export function CartelesMapaWrapper({ carteles }: { carteles: AlquilerRecurso[] }) {
    return <CartelesMapa carteles={carteles} />
}
