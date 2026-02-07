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

interface PrintedPartDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (part: Omit<PrintedPart, "id"> | PrintedPart) => void;
  editPart?: PrintedPart | null;
  /** When adding a new part, preselect this project. */
  defaultProjectId?: string;
}

export function PrintedPartDialog({
  open,
  onOpenChange,
  onSave,
  editPart,
  defaultProjectId,
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
      setFormData({
        name: "",
        filamentId: filaments[0]?.id || "",
        weightUsed: "",
        printTimeHours: "",
        printTimeMinutes: "",
        printDate: new Date().toISOString().split("T")[0],
        notes: "",
        imageUrl: "",
        projectId: defaultProjectId ?? "",
      });
    }
  }, [editPart, open, filaments, defaultProjectId]);

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
      weightUsed: parseInt(formData.weightUsed),
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
    ? (selectedFilament.price / selectedFilament.totalWeight) * parseInt(formData.weightUsed)
    : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto" bottomSheet>
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
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
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

            <div className="space-y-2">
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
              <div className="space-y-2">
                <Label htmlFor="project">Project (optional)</Label>
                <Select
                  value={formData.projectId || "none"}
                  onValueChange={(value) =>
                    setFormData({ ...formData, projectId: value === "none" ? "" : value })
                  }
                >
                  <SelectTrigger>
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

            <div className="space-y-2">
              <Label htmlFor="filament">Filament Used</Label>
              <Select
                value={formData.filamentId}
                onValueChange={(value) =>
                  setFormData({ ...formData, filamentId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {filaments.map((filament) => (
                    <SelectItem key={filament.id} value={filament.id}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: filament.colorHex }}
                        />
                        {filament.manufacturer} - {filament.material} {filament.color}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weightUsed">Weight Used (g)</Label>
                <Input
                  id="weightUsed"
                  type="number"
                  value={formData.weightUsed}
                  onChange={(e) =>
                    setFormData({ ...formData, weightUsed: e.target.value })
                  }
                  min="0"
                  className="h-9 min-h-9"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="printDate">Print Date</Label>
                <Input
                  id="printDate"
                  type="date"
                  value={formData.printDate}
                  onChange={(e) =>
                    setFormData({ ...formData, printDate: e.target.value })
                  }
                  className="!h-9 min-h-9"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Print Time</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
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
                  />
                </div>
                <div>
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
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Add any notes about the print..."
                rows={3}
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
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">{editPart ? "Update" : "Add"} Part</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}