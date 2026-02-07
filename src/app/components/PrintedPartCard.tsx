import { Card } from "@/app/components/ui/card";
import { MaterialChip } from "@/app/components/figma/MaterialChip";
import { getIconShadow } from "@/app/components/ui/utils";
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
      className="!p-[16px] gap-0 w-full max-w-none hover:shadow-lg transition-all active:scale-95 cursor-pointer"
      onClick={() => onClick?.(part)}
    >
      <div className="flex items-center w-full gap-4">
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
          style={{
            backgroundColor: filamentColor || "#9ca3af",
            boxShadow: getIconShadow(filamentColor || "#9ca3af"),
          }}
        >
          <PartsIcon active className="w-6 h-6 text-white drop-shadow-md" />
        </div>
        <div className="flex-1 min-w-0 w-full">
          <h3 className="font-semibold truncate">{part.name}</h3>
          <div className="flex flex-wrap gap-2 mt-1 w-full">
            <MaterialChip>{formattedDate}</MaterialChip>
          </div>
        </div>
      </div>

      <div className="space-y-2 w-full mt-3">
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