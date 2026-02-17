import { useState, useEffect, useRef } from "react";
import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { PrintedPart } from "@/app/context/AppContext";
import { useApp } from "@/app/context/AppContext";
import { resizeImageToDataUrl } from "@/app/lib/imageUtils";
import { FilamentIcon } from "@/imports/filament-icon";
import { isLightColor } from "@/app/components/ui/utils";

export interface PartDialogInitialData {
  printTimeHours?: number;
  printTimeMinutes?: number;
  weightUsed?: number;
  notes?: string;
}

interface PrintedPartDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (part: Omit<PrintedPart, "id"> | PrintedPart) => void;
  editPart?: PrintedPart | null;
  /** When adding a new part, preselect this project. */
  defaultProjectId?: string;
  /** Pre-fill form when adding (e.g. from image scan). */
  initialData?: PartDialogInitialData;
}

export function PrintedPartDialog({
  open,
  onOpenChange,
  onSave,
  editPart,
  defaultProjectId,
  initialData,
}: PrintedPartDialogProps) {
  const { filaments, projects } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    filamentId: "",
    weightUsed: "",
    printTimeHours: "",
    printTimeMinutes: "",
    printDate: new Date().toISOString().split("T")[0],
    notes: "",
    imageUrl: "" as string,
    projectId: "" as string,
  });

  useEffect(() => {
    if (editPart) {
      const hours = Math.floor(editPart.printTime / 60);
      const minutes = editPart.printTime % 60;
      setFormData({
        name: editPart.name,
        filamentId: editPart.filamentId,
        weightUsed: editPart.weightUsed.toString(),
        printTimeHours: hours.toString(),
        printTimeMinutes: minutes.toString(),
        printDate: editPart.printDate,
        notes: editPart.notes || "",
        imageUrl: editPart.imageUrl || "",
        projectId: editPart.projectId ?? "",
      });
    } else {
      const base = {
        name: "",
        filamentId: filaments[0]?.id || "",
        weightUsed: initialData?.weightUsed != null ? String(initialData.weightUsed) : "",
        printTimeHours: initialData?.printTimeHours != null ? String(initialData.printTimeHours) : "",
        printTimeMinutes: initialData?.printTimeMinutes != null ? String(initialData.printTimeMinutes) : "",
        printDate: new Date().toISOString().split("T")[0],
        notes: initialData?.notes ?? "",
        imageUrl: "",
        projectId: defaultProjectId ?? "",
      };
      setFormData(base);
    }
  }, [editPart, open, filaments, defaultProjectId, initialData]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    e.target.value = "";
    try {
      const dataUrl = await resizeImageToDataUrl(file);
      setFormData((prev) => ({ ...prev, imageUrl: dataUrl }));
    } catch {
      setFormData((prev) => ({ ...prev, imageUrl: "" }));
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const printTime =
      (parseInt(formData.printTimeHours) || 0) * 60 +
      (parseInt(formData.printTimeMinutes) || 0);

    const partData: Omit<PrintedPart, "id"> = {
      name: formData.name,
      filamentId: formData.filamentId,
      weightUsed: parseFloat(formData.weightUsed),
      printTime,
      printDate: formData.printDate,
      notes: formData.notes || undefined,
      imageUrl: formData.imageUrl || undefined,
      projectId: formData.projectId || undefined,
    };

    if (editPart) {
      onSave({ ...partData, id: editPart.id });
    } else {
      onSave(partData);
    }

    onOpenChange(false);
  };

  // Calculate estimated cost
  const selectedFilament = filaments.find((f) => f.id === formData.filamentId);
  const estimatedCost = selectedFilament?.price && formData.weightUsed
    ? (selectedFilament.price / selectedFilament.totalWeight) * parseFloat(formData.weightUsed)
    : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto overflow-x-hidden w-full max-w-full grid-cols-1" bottomSheet>
        <DialogHeader>
          <DialogTitle>
            {editPart ? "Edit Printed Part" : "Add Printed Part"}
          </DialogTitle>
          <DialogDescription>
            {editPart
              ? "Update the details of your printed part."
              : "Record a new 3D printed part."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="w-full min-w-0 grid grid-cols-1">
          <div className="grid grid-cols-1 w-full min-w-0 gap-3 py-2">
            {/* Part photo hidden for now */}
            {false && (
              <div className="space-y-2">
                <Label>Part Photo</Label>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                {formData.imageUrl ? (
                  <div className="rounded-lg overflow-hidden bg-muted border">
                    <img src={formData.imageUrl} alt="Part" className="w-full aspect-video object-cover" />
                    <div className="flex gap-2 p-2">
                      <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={uploading}>{uploading ? "Uploading…" : "Change image"}</Button>
                      <Button type="button" variant="ghost" size="sm" className="text-destructive" onClick={() => setFormData((p) => ({ ...p, imageUrl: "" }))}>Remove</Button>
                    </div>
                  </div>
                ) : (
                  <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="w-full rounded-lg border-2 border-dashed border-muted-foreground/30 aspect-video flex flex-col items-center justify-center gap-2 text-muted-foreground hover:bg-muted/50 transition-colors">
                    <span className="text-2xl" aria-hidden>📷</span>
                    <span className="text-sm">{uploading ? "Uploading…" : "Add photo"}</span>
                  </button>
                )}
              </div>
            )}

            <div className="space-y-1.5 w-full min-w-0">
              <Label htmlFor="name">Part Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., Phone Stand"
                required
              />
            </div>

            {projects.length > 0 && (
              <div className="space-y-1.5 w-full min-w-0">
                <Label htmlFor="project">Project (optional)</Label>
                <Select
                  value={formData.projectId || "none"}
                  onValueChange={(value) =>
                    setFormData({ ...formData, projectId: value === "none" ? "" : value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {projects.map((proj) => (
                      <SelectItem key={proj.id} value={proj.id}>
                        {proj.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-1.5 w-full min-w-0">
              <Label htmlFor="filament">Filament Used</Label>
              <Select
                value={formData.filamentId}
                onValueChange={(value) =>
                  setFormData({ ...formData, filamentId: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {filaments.map((filament) => (
                    <SelectItem key={filament.id} value={filament.id}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 border border-[#E5E5E5]"
                          style={{ backgroundColor: filament.colorHex }}
                        >
                          <FilamentIcon
                            active
                            className={`w-3 h-3 ${isLightColor(filament.colorHex) ? "text-gray-400" : "text-white"}`}
                          />
                        </div>
                        {filament.manufacturer} - {filament.material} {filament.color}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-row gap-3 w-full min-w-0">
              <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                <Label htmlFor="weightUsed">Weight Used (g)</Label>
                <div className="h-[36px] w-full min-w-0 overflow-hidden rounded-md border border-input bg-input-background [&_input]:h-full [&_input]:min-h-full [&_input]:max-h-full [&_input]:border-0 [&_input]:rounded-md">
                  <Input
                    id="weightUsed"
                    type="number"
                    step="any"
                    value={formData.weightUsed}
                    onChange={(e) =>
                      setFormData({ ...formData, weightUsed: e.target.value })
                    }
                    min="0"
                    className="w-full min-w-0 h-full min-h-full max-h-full border-0 rounded-md"
                    required
                  />
                </div>
              </div>
              <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                <Label htmlFor="printDate">Print Date</Label>
                <div className="relative h-[36px] w-full min-w-0 overflow-hidden rounded-md border border-input bg-input-background">
                  <div className="absolute inset-0 flex items-center justify-start px-3 text-sm text-foreground pointer-events-none">
                    {formData.printDate
                      ? new Date(formData.printDate + "T12:00:00").toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                      : ""}
                  </div>
                  <input
                    id="printDate"
                    type="date"
                    value={formData.printDate}
                    onChange={(e) =>
                      setFormData({ ...formData, printDate: e.target.value })
                    }
                    required
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer text-sm"
                    aria-label="Print date"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5 w-full min-w-0">
              <Label>Print Time</Label>
              <div className="grid grid-cols-[1fr_1fr] gap-3 w-full min-w-0">
                <div className="min-w-0 w-full h-[36px] overflow-hidden rounded-md border border-input bg-input-background [&_input]:h-full [&_input]:min-h-full [&_input]:max-h-full [&_input]:border-0 [&_input]:rounded-md">
                  <Input
                    type="number"
                    value={formData.printTimeHours}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        printTimeHours: e.target.value,
                      })
                    }
                    placeholder="Hours"
                    min="0"
                    className="w-full min-w-0 h-full min-h-full max-h-full border-0 rounded-md"
                  />
                </div>
                <div className="min-w-0 w-full h-[36px] overflow-hidden rounded-md border border-input bg-input-background [&_input]:h-full [&_input]:min-h-full [&_input]:max-h-full [&_input]:border-0 [&_input]:rounded-md">
                  <Input
                    type="number"
                    value={formData.printTimeMinutes}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        printTimeMinutes: e.target.value,
                      })
                    }
                    placeholder="Minutes"
                    min="0"
                    max="59"
                    className="w-full min-w-0 h-full min-h-full max-h-full border-0 rounded-md"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5 w-full min-w-0">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Add any notes about the print..."
                rows={3}
                className="w-full min-w-0"
              />
            </div>

            {/* Estimated Cost Display */}
            {estimatedCost !== null && !isNaN(estimatedCost) && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Estimated Cost
                  </span>
                  <span className="text-lg font-semibold text-green-600">
                    ${estimatedCost.toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Based on filament price: ${selectedFilament?.price?.toFixed(2)} for {selectedFilament?.totalWeight}g
                </p>
              </div>
            )}
          </div>
          <DialogFooter className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full"
            >
              Cancel
            </Button>
            <Button type="submit" className="w-full">{editPart ? "Update" : "Add"} Part</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}