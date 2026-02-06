import { Trash2, Edit2, Clock, Weight, DollarSign } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { PrintedPart } from "@/app/context/AppContext";
import { PartsIcon } from "@/imports/parts-icon";

interface PrintedPartCardProps {
  part: PrintedPart;
  filamentName?: string;
  filamentColor?: string;
  filamentPrice?: number;
  filamentTotalWeight?: number;
  onEdit: (part: PrintedPart) => void;
  onDelete: (id: string) => void;
  onClick?: (part: PrintedPart) => void;
}

export function PrintedPartCard({
  part,
  filamentName,
  filamentColor,
  filamentPrice,
  filamentTotalWeight,
  onEdit,
  onDelete,
  onClick,
}: PrintedPartCardProps) {
  const formattedDate = new Date(part.printDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // Calculate part cost
  const partCost = filamentPrice && filamentTotalWeight
    ? (filamentPrice / filamentTotalWeight) * part.weightUsed
    : null;

  return (
    <Card
      className="p-4 hover:shadow-lg transition-all active:scale-95 cursor-pointer"
      onClick={() => onClick?.(part)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center shadow-md"
            style={{ backgroundColor: filamentColor || "#gray" }}
          >
            <PartsIcon className="w-6 h-6 text-white drop-shadow-md" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{part.name}</h3>
            <div className="flex gap-2 mt-1">
              <Badge variant="outline" className="text-xs">
                {formattedDate}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2 mt-1.5">
        <div className="flex justify-between items-baseline gap-3 text-sm">
          <span className="text-muted-foreground shrink-0">Weight Used</span>
          <span className="font-medium tabular-nums text-right min-w-[4rem]">{part.weightUsed}g</span>
        </div>
        <div className="flex justify-between items-baseline gap-3 text-sm">
          <span className="text-muted-foreground shrink-0">Cost</span>
          <span className="font-medium text-green-600 tabular-nums text-right min-w-[4rem]">
            {partCost !== null ? `$${partCost.toFixed(2)}` : "—"}
          </span>
        </div>
      </div>
    </Card>
  );
}