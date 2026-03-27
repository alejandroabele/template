import EstadoPersonalTable from "@/components/tables/estado-personal-table";

export default function EstadoPersonalPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Estado del personal</h1>
        <p className="text-muted-foreground text-sm">
          Asignaciones de jornada del día de hoy
        </p>
      </div>
      <EstadoPersonalTable />
    </div>
  );
}
