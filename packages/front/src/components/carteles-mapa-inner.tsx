"use client";
import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { AlquilerRecurso } from "@/types";
import { Eye, Map } from "lucide-react";
import { Currency } from "@/components/ui/currency";
import { Badge } from "@/components/ui/badge";

const NEUQUEN: [number, number] = [-38.9516, -68.0591];

const COLORES_ESTADO: Record<string, string> = {
  LIBRE: "#15803d", // green-700
  ARRENDADO: "#4338ca", // indigo-700
  EN_NEGOCIACION: "#be185d", // pink-700
};

const crearIconoEstado = (estado: string, codigo: string) => {
  const color = COLORES_ESTADO[estado] ?? "#9ca3af";
  return L.divIcon({
    className: "",
    html: `<div style="display:inline-flex; flex-direction:column; align-items:center;">
            <div style="
                background: ${color};
                color: white;
                border: 2px solid white;
                border-radius: 999px;
                box-shadow: 0 2px 6px rgba(0,0,0,0.35);
                padding: 2px 8px;
                font-size: 11px;
                font-weight: 600;
                font-family: Arial, Helvetica, sans-serif;
                white-space: nowrap;
                line-height: 1.4;
            ">${codigo}</div>
            <div style="
                width: 0; height: 0;
                border-left: 5px solid transparent;
                border-right: 5px solid transparent;
                border-top: 6px solid ${color};
                margin-top: -1px;
            "></div>
        </div>`,
    iconSize: undefined,
    iconAnchor: undefined,
    popupAnchor: [0, -28],
  });
};

type Cartel = AlquilerRecurso & {
  estado: string;
  otActivaId?: number | null;
  vencimientoContrato?: string | null;
  clienteNombre?: string | null;
};

function BotonesUbicacion({ lat, lng }: { lat: number; lng: number }) {
  const [copiadoSV, setCopiadoSV] = useState(false);
  const [copiadoMaps, setCopiadoMaps] = useState(false);

  const copiarStreetView = () => {
    navigator.clipboard.writeText(`https://maps.google.com/maps?q=&layer=c&cbll=${lat},${lng}`);
    setCopiadoSV(true);
    setTimeout(() => setCopiadoSV(false), 2000);
  };

  const copiarMaps = () => {
    navigator.clipboard.writeText(`https://www.google.com/maps?q=${lat},${lng}`);
    setCopiadoMaps(true);
    setTimeout(() => setCopiadoMaps(false), 2000);
  };

  const btnStyle = {
    padding: "5px 10px",
    borderRadius: "6px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    cursor: "pointer",
    transition: "all 0.2s",
    background: "#f9fafb",
    color: "#374151",
  };

  return (
    <div style={{ marginTop: "8px", display: "flex", gap: "6px" }}>
      <button onClick={copiarStreetView} style={{ ...btnStyle, ...(copiadoSV ? { background: "#16a34a", color: "#fff" } : {}) }} title="Copiar Street View">
        {copiadoSV ? "✓" : <Eye size={14} />}
      </button>
      <button onClick={copiarMaps} style={{ ...btnStyle, ...(copiadoMaps ? { background: "#16a34a", color: "#fff" } : {}) }} title="Copiar Google Maps">
        {copiadoMaps ? "✓" : <Map size={14} />}
      </button>
    </div>
  );
}

export default function CartelesMapa({ carteles }: { carteles: Cartel[] }) {
  return (
    <MapContainer
      center={NEUQUEN}
      zoom={11}
      style={{ height: "80vh", width: "80vw", borderRadius: "8px" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {carteles.map((cartel) => {
        const coordenadas = cartel.cartel?.coordenadas;
        const partes = coordenadas?.split(",");
        if (!partes || partes.length !== 2) return null;
        const lat = parseFloat(partes[0]);
        const lng = parseFloat(partes[1]);
        if (isNaN(lat) || isNaN(lng)) return null;

        const localidad = cartel.cartel?.localidad;
        const zona = cartel.cartel?.zona;
        const formato = cartel.cartel?.formato;

        return (
          <Marker
            key={cartel.id}
            position={[lat, lng]}
            icon={crearIconoEstado(cartel.estado, cartel.codigo)}
          >
            <Popup>
              <div
                className="space-y-1 text-sm min-w-[180px]"
                style={{ color: "#111827" }}
              >
                <div
                  className="font-semibold text-base"
                  style={{ color: "#111827" }}
                >
                  {cartel.codigo}
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    style={{
                      backgroundColor:
                        COLORES_ESTADO[cartel.estado] ?? "#9ca3af",
                    }}
                    className="text-white text-xs"
                  >
                    {cartel.estado?.replace(/_/g, " ")}
                  </Badge>
                  {cartel.otActivaId != null && (
                    <Badge className="bg-orange-500 text-white text-xs">
                      OT #{cartel.otActivaId}
                    </Badge>
                  )}
                </div>
                {localidad && (
                  <div>
                    <span className="text-muted-foreground">Localidad:</span>{" "}
                    {localidad}
                  </div>
                )}
                {zona && (
                  <div>
                    <span className="text-muted-foreground">Zona:</span> {zona}
                  </div>
                )}
                {formato && (
                  <div>
                    <span className="text-muted-foreground">Formato:</span>{" "}
                    {formato}
                  </div>
                )}
                {cartel.precio != null && (
                  <div>
                    <span className="text-muted-foreground">Precio:</span>{" "}
                    <Currency>{cartel.precio}</Currency>
                  </div>
                )}
                {cartel.estado === "ARRENDADO" && cartel.clienteNombre && (
                  <div style={{ color: "#111827" }}>
                    <span style={{ color: "#6b7280" }}>Cliente:</span>{" "}
                    <strong>{cartel.clienteNombre}</strong>
                  </div>
                )}
                {cartel.estado === "ARRENDADO" && (
                  <div style={{ color: "#111827" }}>
                    <span style={{ color: "#6b7280" }}>Vence:</span>{" "}
                    {cartel.vencimientoContrato ? (
                      new Date(
                        cartel.vencimientoContrato + "T00:00:00"
                      ).toLocaleDateString("es-AR")
                    ) : (
                      <span style={{ color: "#9ca3af", fontStyle: "italic" }}>
                        Indeterminado
                      </span>
                    )}
                  </div>
                )}
                <BotonesUbicacion lat={lat} lng={lng} />
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
