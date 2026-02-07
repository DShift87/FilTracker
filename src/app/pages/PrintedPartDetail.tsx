import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { getIconShadow } from "@/app/components/ui/utils";
import { MaterialChip } from "@/app/components/figma/MaterialChip";
import { useApp } from "@/app/context/AppContext";
import { PrintedPartDialog } from "@/app/components/PrintedPartDialog";
import { resizeImageToDataUrl } from "@/app/lib/imageUtils";
import { toast } from "sonner";
import { PartsIcon } from "@/imports/parts-icon";
import { InventoryValueIcon } from "@/imports/inventory-value-icon";
import { PrintTimeIcon } from "@/imports/print-time-icon";
import { DeleteIcon } from "@/imports/delete-icon";
import { EditIcon } from "@/imports/edit-icon";
import { WeightIcon } from "@/imports/weight-icon";
import { AddImageIcon } from "@/imports/add-image-icon";
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

export function PrintedPartDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { printedParts, updatePrintedPart, deletePrintedPart, filaments } = useApp();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const part = printedParts.find((p) => p.id === id);

  if (!part) {
    return (
      <div
        className="flex items-center justify-center h-screen"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Part not found</h2>
          <Button onClick={() => navigate("/parts")}>Go back</Button>
        </div>
      </div>
    );
  }

  const filament = filaments.find((f) => f.id === part.filamentId);
  const printHours = Math.floor(part.printTime / 60);
  const printMinutes = part.printTime % 60;
  const formattedDate = new Date(part.printDate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // Calculate part cost
  const partCost =
    filament?.price && filament?.totalWeight
      ? (filament.price / filament.totalWeight) * part.weightUsed
      : null;

  const handleDelete = () => {
    deletePrintedPart(part.id);
    navigate("/parts");
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    e.target.value = "";
    setUploading(true);
    try {
      const dataUrl = await resizeImageToDataUrl(file);
      updatePrintedPart({ ...part, imageUrl: dataUrl });
      toast.success("Image added");
    } catch {
      toast.error("Failed to process image");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    updatePrintedPart({ ...part, imageUrl: undefined });
    toast.success("Image removed");
  };

  return (
    <div
      className="min-h-screen bg-background pb-20"
      style={{ paddingTop: "max(0.5rem, env(safe-area-inset-top))" }}
    >
      <div className="p-4 space-y-4 max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between pt-2">
          <Button variant="ghost" onClick={() => navigate("/parts")} size="sm">
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

        {/* Main Info Card - icon, name, date only */}
        <Card className="!p-[16px] gap-0 max-w-none">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{
                backgroundColor: filament?.colorHex || "#9ca3af",
                boxShadow: getIconShadow(filament?.colorHex || "#9ca3af"),
              }}
            >
              <PartsIcon active className="w-6 h-6 text-white drop-shadow-md" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold truncate">{part.name}</h1>
              <MaterialChip className="mt-1">{formattedDate}</MaterialChip>
            </div>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 items-stretch">
          <Card className="!p-[16px] gap-0 max-w-none flex flex-col justify-center">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                <WeightIcon className="h-5 w-5 text-blue-500" />
              </div>
              <div className="min-w-0 flex-1 min-h-[2.5rem] flex flex-col justify-center">
                <p className="text-xs text-muted-foreground">Weight Used</p>
                <p className="text-xl font-bold mt-0.5">{part.weightUsed}g</p>
              </div>
            </div>
          </Card>

          <Card className="!p-[16px] gap-0 max-w-none flex flex-col justify-center">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
                <PrintTimeIcon className="h-5 w-5 text-purple-500" />
              </div>
              <div className="min-w-0 flex-1 min-h-[2.5rem] flex flex-col justify-center">
                <p className="text-xs text-muted-foreground">Print Time</p>
                <p className="text-xl font-bold mt-0.5">
                  {printHours > 0 ? `${printHours}h ` : ""}
                  {printMinutes}m
                </p>
              </div>
            </div>
          </Card>

          <Card className="!p-[16px] gap-0 col-span-2 max-w-none flex flex-col justify-center">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                <InventoryValueIcon className="h-5 w-5 text-green-500" />
              </div>
              <div className="min-w-0 flex-1 min-h-[2.5rem] flex flex-col justify-center">
                <p className="text-xs text-muted-foreground">Estimated Cost</p>
                <p className="text-xl font-bold text-green-600 mt-0.5">
                  {partCost !== null ? `$${partCost.toFixed(2)}` : "—"}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filament Details */}
        {filament && (
          <Card className="!p-[16px] gap-0 max-w-none">
            <h2 className="font-semibold mb-3">Filament Details</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Material</span>
                <MaterialChip>{filament.material}</MaterialChip>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Color</span>
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: filament.colorHex }}
                  />
                  <span>{filament.color}</span>
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Manufacturer</span>
                <span>{filament.manufacturer}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Diameter</span>
                <span>{filament.diameter}mm</span>
              </div>
            </div>
          </Card>
        )}

        {/* Notes */}
        {part.notes && (
          <Card className="!p-[16px] gap-0 max-w-none">
            <h2 className="font-semibold mb-2">Notes</h2>
            <p className="text-sm text-muted-foreground">{part.notes}</p>
          </Card>
        )}

        {/* Part Image */}
        <Card className="!p-[16px] gap-0 max-w-none">
          <h2 className="font-semibold mb-3">Part Image</h2>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleImageUpload}
            disabled={uploading}
          />
          {part.imageUrl ? (
            <div className="rounded-lg overflow-hidden bg-muted border">
              <img
                src={part.imageUrl}
                alt={part.name}
                className="w-full aspect-video object-cover"
              />
              <div className="flex gap-2 p-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? "Uploading…" : "Change image"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-destructive"
                  onClick={handleRemoveImage}
                >
                  Remove
                </Button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full rounded-lg border-2 border-dashed border-muted-foreground/30 aspect-video flex flex-col items-center justify-center gap-3 text-muted-foreground hover:bg-muted/50 transition-colors"
            >
              <AddImageIcon className="w-12 h-12" />
              <span className="text-sm font-medium">{uploading ? "Uploading…" : "Add part image"}</span>
            </button>
          )}
        </Card>
      </div>

      {/* Edit Dialog */}
      <PrintedPartDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={(updatedPart) => {
          updatePrintedPart(updatedPart);
          setEditDialogOpen(false);
        }}
        editPart={part}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent bottomSheet>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Part?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{part.name}"? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}