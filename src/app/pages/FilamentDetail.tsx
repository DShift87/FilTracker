import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Ruler, Download, Printer } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { getIconShadow } from "@/app/components/ui/utils";
import { Progress } from "@/app/components/ui/progress";
import { Badge } from "@/app/components/ui/badge";
import { MaterialChip } from "@/app/components/figma/MaterialChip";
import { useApp } from "@/app/context/AppContext";
import { FilamentDialog } from "@/app/components/FilamentDialog";
import { QRCodeSVG } from "qrcode.react";
import { FilamentIcon } from "@/imports/filament-icon";
import { DeleteIcon } from "@/imports/delete-icon";
import { EditIcon } from "@/imports/edit-icon";
import { WeightIcon } from "@/imports/weight-icon";
import { PartsIcon } from "@/imports/parts-icon";
import { BoxIcon } from "@/imports/box-icon";
import { InventoryValueIcon } from "@/imports/inventory-value-icon";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/app/components/ui/alert-dialog";

export function FilamentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { filaments, updateFilament, deleteFilament, printedParts } = useApp();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);

  const filament = filaments.find((f) => f.id === id);

  if (!filament) {
    return (
      <div
        className="p-4 max-w-md mx-auto"
        style={{ paddingTop: "max(0.5rem, env(safe-area-inset-top))" }}
      >
        <Button variant="ghost" onClick={() => navigate("/filaments")} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="text-center py-12">
          <BoxIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-semibold mb-2">Filament not found</h3>
        </div>
      </div>
    );
  }

  const percentageRemaining = (filament.remainingWeight / filament.totalWeight) * 100;
  const isLow = percentageRemaining < 20;
  const isMedium = percentageRemaining >= 20 && percentageRemaining <= 49;
  const isHigh = percentageRemaining > 50;
  const weightUsed = filament.totalWeight - filament.remainingWeight;

  const getProgressColor = () => {
    if (isHigh) return "bg-green-500";
    if (isMedium) return "bg-orange-500";
    return "bg-red-500";
  };

  // Find parts printed with this filament
  const partsWithFilament = printedParts.filter((p) => p.filamentId === filament.id);
  const totalPartsWeight = partsWithFilament.reduce((sum, p) => sum + p.weightUsed, 0);

  const handleDelete = () => {
    deleteFilament(filament.id);
    navigate("/filaments");
  };

  // Create a JSON string with all filament data
  const filamentData = JSON.stringify({
    id: filament.id,
    name: filament.name,
    material: filament.material,
    color: filament.color,
    colorHex: filament.colorHex,
    totalWeight: filament.totalWeight,
    remainingWeight: filament.remainingWeight,
    manufacturer: filament.manufacturer,
    diameter: filament.diameter,
    price: filament.price,
  });

  const handleDownloadQR = () => {
    const svg = document.getElementById("filament-qr-code");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `${filament.manufacturer}-${filament.material}-QR.png`;
          link.click();
          URL.revokeObjectURL(url);
        }
      });
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const handlePrintQR = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const svg = document.getElementById("filament-qr-code");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print QR Code - ${filament.manufacturer} ${filament.material}</title>
          <style>
            body {
              margin: 0;
              padding: 20px;
              display: flex;
              flex-direction: column;
              align-items: center;
              font-family: system-ui, -apple-system, sans-serif;
            }
            .qr-container {
              text-align: center;
            }
            h1 {
              font-size: 24px;
              margin-bottom: 10px;
            }
            .details {
              margin: 20px 0;
              font-size: 14px;
            }
            .details div {
              margin: 5px 0;
            }
            @media print {
              body {
                padding: 10px;
              }
            }
          </style>
        </head>
        <body>
          <div class="qr-container">
            <h1>${filament.manufacturer} - ${filament.material}</h1>
            <div class="details">
              <div><strong>Color:</strong> ${filament.color}</div>
              <div><strong>Diameter:</strong> ${filament.diameter}mm</div>
              <div><strong>Weight:</strong> ${filament.totalWeight}g</div>
              ${filament.price ? `<div><strong>Price:</strong> $${filament.price.toFixed(2)}</div>` : ""}
            </div>
            ${svgData}
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  return (
    <div
      className="min-h-screen bg-background pb-20"
      style={{ paddingTop: "max(0.5rem, env(safe-area-inset-top))" }}
    >
      <div className="pl-4 pr-8 pt-4 pb-4 space-y-4 max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between pt-2">
          <Button variant="ghost" onClick={() => navigate("/filaments")} size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditDialogOpen(true)}
            >
              <EditIcon className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-destructive"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <DeleteIcon className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        {/* Main Info Card - same layout as part detail: icon, title, badges below */}
        <Card className="!p-[16px] gap-0 w-full max-w-none">
          <div className="flex items-center gap-4 w-full">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: filament.colorHex, boxShadow: getIconShadow(filament.colorHex) }}
            >
              <FilamentIcon active className="w-6 h-6 text-white drop-shadow-md" />
            </div>
            <div className="flex-1 min-w-0 w-full">
              <h1 className="text-lg font-semibold truncate">{filament.manufacturer}</h1>
              <div className="flex flex-wrap gap-2 mt-1 w-full">
                <MaterialChip>{filament.material}</MaterialChip>
                <MaterialChip variant="outlined">{filament.diameter}mm</MaterialChip>
                {isLow && <Badge variant="destructive">Low Stock</Badge>}
              </div>
            </div>
          </div>
        </Card>

        {/* Filament Properties */}
        <Card className="!p-[16px] gap-0 max-w-none">
          <div className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-3 items-center">
            <span className="text-muted-foreground">Color</span>
            <div className="flex justify-end items-center gap-2 min-w-0">
              <div
                className="w-5 h-5 rounded border shrink-0"
                style={{ backgroundColor: filament.colorHex }}
              />
              <span className="font-medium text-right">{filament.color}</span>
            </div>
            {filament.price && (
              <>
                <span className="text-muted-foreground">Price</span>
                <span className="font-medium text-right">${filament.price.toFixed(2)}</span>
              </>
            )}
          </div>
        </Card>

        {/* Weight Status */}
        <Card className="!p-[16px] gap-0 max-w-none">
          <h2 className="font-semibold mb-3">Weight Status</h2>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Remaining</span>
                <span className={`font-medium ${isLow ? "text-destructive" : ""}`}>
                  {filament.remainingWeight}g / {filament.totalWeight}g
                </span>
              </div>
              <div className="relative h-2 w-full overflow-hidden rounded-full bg-[#E5E5E5]">
                <div
                  className={`h-full rounded-full transition-all ${getProgressColor()}`}
                  style={{ width: `${percentageRemaining}%` }}
                />
              </div>
              <div className="flex justify-end mt-1">
                <p className="text-xs text-muted-foreground">
                  {percentageRemaining.toFixed(1)}% remaining
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                  <WeightIcon className="h-5 w-5 text-green-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Available</p>
                  <p className="font-semibold mt-0.5">{filament.remainingWeight}g</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
                  <WeightIcon className="h-5 w-5 text-orange-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Used</p>
                  <p className="font-semibold mt-0.5">{weightUsed}g</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 w-full items-stretch">
          <Card className="!p-[16px] gap-0 w-full max-w-none flex flex-col justify-center">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                <PartsIcon active className="h-5 w-5 text-blue-500" />
              </div>
              <div className="min-w-0 flex-1 min-h-[2.5rem] flex flex-col justify-center">
                <p className="text-xs text-muted-foreground">Parts Printed</p>
                <p className="text-xl font-bold mt-0.5">{partsWithFilament.length}</p>
              </div>
            </div>
          </Card>

          <Card className="!p-[16px] gap-0 w-full max-w-none flex flex-col justify-center">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                <InventoryValueIcon className="h-5 w-5 text-green-500" />
              </div>
              <div className="min-w-0 flex-1 min-h-[2.5rem] flex flex-col justify-center">
                <p className="text-xs text-muted-foreground">Cost per gram</p>
                <p className="text-xl font-bold mt-0.5">
                  {filament.price
                    ? `$${(filament.price / filament.totalWeight).toFixed(3)}`
                    : "—"}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* QR Code Section - p-4 for alignment with top cards */}
        <Card className="!p-[16px] gap-0 max-w-none">
          <h2 className="font-semibold mb-3">Spool Label</h2>
          <div className="flex flex-col items-center gap-4">
            <div className="bg-white p-4 rounded-lg">
              <QRCodeSVG
                value={filamentData}
                size={200}
                level="H"
                includeMargin={true}
                id="filament-qr-code"
              />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Scan this QR code to quickly identify this filament spool
            </p>
            <div className="flex gap-2 w-full">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleDownloadQR}
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={handlePrintQR}
              >
                <Printer className="mr-2 h-4 w-4" />
                Print Label
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Edit Dialog */}
      <FilamentDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={(filamentData) => {
          if ("id" in filamentData) {
            updateFilament(filamentData);
          }
        }}
        editFilament={filament}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent bottomSheet>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Filament?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{filament.name}"? This action cannot be
              undone.
              {partsWithFilament.length > 0 && (
                <span className="block mt-2 text-orange-600">
                  Note: {partsWithFilament.length} printed part
                  {partsWithFilament.length !== 1 ? "s" : ""} used this filament.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}