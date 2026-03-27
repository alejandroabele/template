import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";
import { formatMoney } from "@/utils/number";

interface RubroProps {
  rubroId: number | null;
  rubroNombre: string | null;
  tipo: "ingreso" | "egreso";
  columnas: string[];
  totalesRubro: Record<string, number>;
  isCollapsed: boolean;
  onToggle: (id: string) => void;
}

export const Rubro: React.FC<RubroProps> = ({
  rubroId,
  rubroNombre,
  tipo,
  columnas,
  totalesRubro,
  isCollapsed,
  onToggle,
}) => {
  const rubroKey = rubroId ? `rubro-${rubroId}` : "sin-rubro";
  const displayName = rubroNombre || "Sin Rubro";

  return (
    <TableRow
      className={`${
        tipo === "ingreso"
          ? "bg-emerald-100 hover:bg-emerald-100 border-emerald-100"
          : "bg-rose-100 hover:bg-rose-100 border-rose-100"
      } border-b cursor-pointer`}
      onClick={() => onToggle(rubroKey)}
    >
      <TableCell className="py-2 px-3 w-[200px] sticky left-0 bg-inherit z-10">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onToggle(rubroKey);
            }}
            className="h-5 w-5 p-0 hover:bg-white/50"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
          {/* <FolderKanban className="h-4 w-4 text-muted-foreground" /> */}
          <span className={`font-semibold text-sm `}>{displayName}</span>
        </div>
      </TableCell>

      {columnas.map((fecha) => {
        const total = totalesRubro[fecha] || 0;
        return (
          <TableCell key={fecha} className="py-2 px-3 text-center">
            <div
              className={`font-bold text-sm whitespace-nowrap ${
                total > 0
                  ? tipo === "ingreso"
                    ? "text-emerald-700"
                    : "text-rose-700"
                  : "text-muted-foreground"
              }`}
            >
              {formatMoney(total || 0)}
            </div>
          </TableCell>
        );
      })}
    </TableRow>
  );
};
