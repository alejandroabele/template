"use client"
import dynamic from "next/dynamic"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const CoordenadasPickerMap = dynamic(
    () => import("@/components/coordenadas-picker-map"),
    { ssr: false, loading: () => <div className="h-[280px] w-full bg-muted rounded-lg animate-pulse" /> }
)

type Props = {
    lat: number | null
    lng: number | null
    onLatChange: (val: number | null) => void
    onLngChange: (val: number | null) => void
}

export function CoordenadasPicker({ lat, lng, onLatChange, onLngChange }: Props) {
    const handleMapClick = (newLat: number, newLng: number) => {
        onLatChange(parseFloat(newLat.toFixed(6)))
        onLngChange(parseFloat(newLng.toFixed(6)))
    }

    const handleLatInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        onLatChange(val === "" ? null : parseFloat(val))
    }

    const handleLngInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        onLngChange(val === "" ? null : parseFloat(val))
    }

    return (
        <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                    <Label>Latitud</Label>
                    <Input
                        type="number"
                        step="any"
                        placeholder="-38.9516"
                        value={lat ?? ""}
                        onChange={handleLatInput}
                    />
                </div>
                <div className="space-y-1">
                    <Label>Longitud</Label>
                    <Input
                        type="number"
                        step="any"
                        placeholder="-68.0591"
                        value={lng ?? ""}
                        onChange={handleLngInput}
                    />
                </div>
            </div>
            <CoordenadasPickerMap lat={lat} lng={lng} onChange={handleMapClick} />
            <p className="text-xs text-muted-foreground">
                Hacé click en el mapa para seleccionar la ubicación o ingresá las coordenadas manualmente.
            </p>
        </div>
    )
}
