import { Card } from "@/app/components/ui/card";
import { MaterialChip } from "@/app/components/figma/MaterialChip";
import { getIconShadow } from "@/app/components/ui/utils";
import { FilamentIcon } from "@/imports/filament-icon";

export interface Filament {
  id: string;
  name: string;
  material: string;
  color: string;
  colorHex: string;
  totalWeight: number;
  remainingWeight: number;
  manufacturer: string;
  diameter: number;
  price?: number;
}

interface FilamentCardProps {
  filament: Filament;
  onClick?: (filament: Filament) => void;
}

export function FilamentCard({ filament, onClick }: FilamentCardProps) {
  const percentageRemaining = (filament.remainingWeight / filament.totalWeight) * 100;
  const isLow = percentageRemaining < 20;
  const isMedium = percentageRemaining >= 20 && percentageRemaining <= 49;
  const isHigh = percentageRemaining > 50;

  const getProgressColor = () => {
    if (isHigh) return "bg-green-500";
    if (isMedium) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <Card 
      className="!p-[16px] gap-0 w-full max-w-none hover:shadow-lg transition-all active:scale-95 cursor-pointer"
      onClick={() => onClick?.(filament)}
    >
      <div className="flex items-center w-full gap-4">
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: filament.colorHex, boxShadow: getIconShadow(filament.colorHex) }}
        >
          <FilamentIcon active className="w-6 h-6 text-white drop-shadow-md" />
        </div>
        <div className="flex-1 min-w-0 w-full">
          <h3 className="font-semibold truncate">{filament.manufacturer}</h3>
          <div className="flex flex-wrap gap-2 mt-1 w-full">
            <MaterialChip>{filament.material}</MaterialChip>
            <MaterialChip variant="outlined">{filament.diameter}mm</MaterialChip>
          </div>
        </div>
      </div>

      <div className="space-y-2 w-full mt-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Remaining</span>
          <span className={isLow ? "text-destructive font-medium" : ""}>
            {filament.remainingWeight}g / {filament.totalWeight}g
          </span>
        </div>
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-[#E5E5E5]">
          <div
            className={`h-full rounded-full transition-all ${getProgressColor()}`}
            style={{ width: `${percentageRemaining}%` }}
          />
        </div>
      </div>
    </Card>
  );
}