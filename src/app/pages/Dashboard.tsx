import { AlertTriangle, Clock } from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { MaterialChip } from "@/app/components/figma/MaterialChip";
import { getIconShadow } from "@/app/components/ui/utils";
import { Progress } from "@/app/components/ui/progress";
import { useApp } from "@/app/context/AppContext";
import { Badge } from "@/app/components/ui/badge";
import { FilamentIcon } from "@/imports/filament-icon";
import { PartsIcon } from "@/imports/parts-icon";
import { useNavigate } from "react-router";
import { InventoryValueIcon } from "@/imports/inventory-value-icon";
import { LowStockIcon } from "@/imports/low-stock-icon";
import { RecentPrintsEmptyIcon } from "@/imports/recent-prints-empty-icon";
import { MostUsedEmptyIcon } from "@/imports/most-used-empty-icon";

export function Dashboard() {
  const { filaments, printedParts, isCloudSync, isCloudLoading } = useApp();
  const navigate = useNavigate();

  // Calculate stats
  const totalSpools = filaments.length;
  const lowStockCount = filaments.filter(
    (f) => (f.remainingWeight / f.totalWeight) * 100 < 25
  ).length;
  const totalParts = printedParts.length;
  const totalValue = filaments.reduce((sum, f) => sum + (f.price || 0), 0);

  // Recent activity
  const recentParts = [...printedParts]
    .sort((a, b) => new Date(b.printDate).getTime() - new Date(a.printDate).getTime())
    .slice(0, 3);

  // Total print time
  const totalPrintTime = printedParts.reduce((sum, p) => sum + p.printTime, 0);
  const totalPrintHours = Math.floor(totalPrintTime / 60);

  // Top 3 most used filaments (by weight used)
  const filamentUsage = printedParts.reduce((acc, part) => {
    acc[part.filamentId] = (acc[part.filamentId] || 0) + part.weightUsed;
    return acc;
  }, {} as Record<string, number>);

  const mostUsedFilamentIds = Object.entries(filamentUsage)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([id]) => id);
  const mostUsedFilaments = mostUsedFilamentIds
    .map((id) => filaments.find((f) => f.id === id))
    .filter(Boolean) as typeof filaments;

  return (
    <div className="p-4 space-y-6 max-w-md mx-auto">
      {/* Header */}
      <div className="pt-2">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-3xl font-bold mb-1">Dashboard +</h1>
          {isCloudSync && (
            <span className="text-xs text-muted-foreground shrink-0">
              {isCloudLoading ? "Syncing…" : "☁️ Cloud"}
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          Your 3D printing overview
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 w-full items-stretch">
        <Card className="!p-[16px] gap-0 w-full max-w-none flex flex-col justify-center cursor-pointer hover:bg-accent/50 transition-colors bg-gradient-to-br from-[#F26D00]/10 to-[#F26D00]/5 border-[#F26D00]/20" onClick={() => navigate("/filaments")}>
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: "rgba(242, 109, 0, 0.2)", boxShadow: getIconShadow("#F26D00") }}
            >
              <FilamentIcon active className="h-5 w-5 text-[#F26D00]" />
            </div>
            <div className="min-w-0 flex-1 min-h-[2.5rem] flex flex-col justify-center">
              <p className="text-xs font-medium mb-0.5 text-[#F26D00]/70">Filament Spools</p>
              <p className="text-2xl font-bold leading-none text-[#F26D00]">{totalSpools}</p>
            </div>
          </div>
        </Card>

        <Card className="!p-[16px] gap-0 w-full max-w-none flex flex-col justify-center cursor-pointer hover:bg-accent/50 transition-colors bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-200/50" onClick={() => navigate("/parts")}>
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0"
              style={{ boxShadow: getIconShadow("#3b82f6") }}
            >
              <PartsIcon active className="h-5 w-5 text-blue-600" />
            </div>
            <div className="min-w-0 flex-1 min-h-[2.5rem] flex flex-col justify-center">
              <p className="text-xs text-blue-600/70 mb-0.5 font-medium">Printed Parts</p>
              <p className="text-2xl font-bold leading-none text-blue-600">{totalParts}</p>
            </div>
          </div>
        </Card>

        <Card className="!p-[16px] gap-0 w-full max-w-none flex flex-col justify-center cursor-pointer hover:bg-accent/50 transition-colors bg-gradient-to-br from-red-500/10 to-red-500/5 border-red-200/50" onClick={() => navigate("/filaments", { state: { tab: "low" } })}>
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-10 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0"
              style={{ boxShadow: getIconShadow("#ef4444") }}
            >
              <LowStockIcon className="h-5 w-5 text-red-600" />
            </div>
            <div className="min-w-0 flex-1 min-h-[2.5rem] flex flex-col justify-center">
              <p className="text-xs text-red-600/70 mb-0.5 font-medium">Low Stock</p>
              <p className="text-2xl font-bold leading-none text-red-600">{lowStockCount}</p>
            </div>
          </div>
        </Card>

        <Card className="!p-[16px] gap-0 w-full max-w-none flex flex-col justify-center bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-200/50">
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-10 rounded-lg bg-green-500/20 flex items-center justify-center shrink-0"
              style={{ boxShadow: getIconShadow("#22c55e") }}
            >
              <InventoryValueIcon className="h-5 w-5 text-green-600" />
            </div>
            <div className="min-w-0 flex-1 min-h-[2.5rem] flex flex-col justify-center">
              <p className="text-xs text-green-600/70 mb-0.5 font-medium">Inventory Value</p>
              <p className="text-2xl font-bold leading-none text-green-600">${totalValue.toFixed(0)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity - top 3 + See all */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Recent Prints</h2>
          <button
            type="button"
            onClick={() => navigate("/parts")}
            className="text-sm text-primary font-medium hover:underline"
          >
            See all
          </button>
        </div>
        {recentParts.length > 0 ? (
          <div className="space-y-2">
            {recentParts.map((part) => {
              const filament = filaments.find((f) => f.id === part.filamentId);
              return (
                <Card
                  key={part.id}
                  className="!p-[16px] gap-0 w-full max-w-none cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => navigate(`/parts/${part.id}`)}
                >
                  <div className="flex items-center gap-3 w-full">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: filament?.colorHex || "#9ca3af",
                        boxShadow: getIconShadow(filament?.colorHex || "#9ca3af"),
                      }}
                    >
                      <PartsIcon active className="w-5 h-5 text-white drop-shadow-md" />
                    </div>
                    <div className="flex-1 min-w-0 w-full">
                      <p className="font-medium text-sm truncate">{part.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(part.printDate).toLocaleDateString()} • {part.weightUsed}g
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {Math.floor(part.printTime / 60)}h {part.printTime % 60}m
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="!p-[16px] gap-0 text-center w-full max-w-none">
            <RecentPrintsEmptyIcon className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No prints yet</p>
          </Card>
        )}
      </div>

      {/* Most Used - top 3 + See all */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Most Used</h2>
          <button
            type="button"
            onClick={() => navigate("/filaments")}
            className="text-sm text-primary font-medium hover:underline"
          >
            See all
          </button>
        </div>
        {mostUsedFilaments.length > 0 ? (
          <div className="space-y-2">
            {mostUsedFilaments.map((filament) => (
              <Card
                key={filament.id}
                className="!p-[16px] gap-0 w-full max-w-none cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => navigate(`/filaments/${filament.id}`)}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3 flex-1 min-w-0 w-full">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: filament.colorHex,
                        boxShadow: getIconShadow(filament.colorHex),
                      }}
                    >
                      <FilamentIcon active className="w-5 h-5 text-white drop-shadow-md" />
                    </div>
                    <div className="flex-1 min-w-0 w-full">
                      <p className="font-medium text-sm truncate">{filament.manufacturer}</p>
                      <div className="flex flex-wrap gap-2 mt-1 w-full">
                        <MaterialChip>{filament.material}</MaterialChip>
                        <MaterialChip variant="outlined">{filament.diameter}mm</MaterialChip>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0 ml-2">
                    {filamentUsage[filament.id]}g used
                  </span>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="!p-[16px] gap-0 text-center w-full max-w-none">
            <MostUsedEmptyIcon className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No usage data yet</p>
          </Card>
        )}
      </div>
    </div>
  );
}