"use client"
import { useEffect } from "react"
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Ícono personalizado con divIcon para evitar el bug de webpack con las imágenes de Leaflet
const crearIcono = (color: string) =>
    L.divIcon({
        className: "",
        html: `<div style="
            width: 20px; height: 20px;
            background: ${color};
            border: 2px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 4px rgba(0,0,0,0.4);
        "></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
    })

const iconoDefault = crearIcono("#6366f1")

type Props = {
    lat: number | null
    lng: number | null
    onChange: (lat: number, lng: number) => void
}

function ClickHandler({ onChange }: { onChange: (lat: number, lng: number) => void }) {
    useMapEvents({
        click(e) {
            onChange(e.latlng.lat, e.latlng.lng)
        },
    })
    return null
}

const NEUQUEN: [number, number] = [-38.9516, -68.0591]

export default function CoordenadasPickerMap({ lat, lng, onChange }: Props) {
    const posicion: [number, number] | null =
        lat !== null && lng !== null ? [lat, lng] : null

    return (
        <MapContainer
            center={posicion ?? NEUQUEN}
            zoom={11}
            style={{ height: "280px", width: "100%", borderRadius: "8px" }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ClickHandler onChange={onChange} />
            {posicion && <Marker position={posicion} icon={iconoDefault} />}
        </MapContainer>
    )
}
