import { useState, useEffect } from "react";
import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/app/components/ui/drawer";
import { useIsMobile } from "@/app/components/ui/use-mobile";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Filament } from "./FilamentCard";

interface FilamentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (filament: Omit<Filament, "id"> | Filament) => void;
  editFilament?: Filament | null;
  onShowQR?: (filament: Filament) => void;
}

const MATERIALS = ["PLA", "PLA+", "ABS", "PETG", "TPU", "Nylon", "ASA", "PC", "Other"];
const DIAMETERS = ["1.75", "2.85"];

const MANUFACTURERS = [
  "Hatchbox",
  "eSUN",
  "Polymaker",
  "Prusament",
  "Overture",
  "Inland",
  "Amazon Basics",
  "3D Solutech",
  "MatterHackers",
  "ColorFabb",
  "Atomic Filament",
  "Push Plastic",
  "Proto-pasta",
  "Fillamentum",
  "Taulman3D",
  "IC3D",
  "SUNLU",
  "Marble",
  "Amolen",
  "ERYONE",
  "SainSmart",
  "Gizmo Dorks",
  "CC3D",
  "3D-Fuel",
  "Ninjatek",
  "Verbatim",
  "Dremel",
  "Elegoo",
  "FormFutura",
  "Filamatrix",
  "3DXTech",
];

const COLOR_PRESETS = [
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Red", hex: "#EF4444" },
  { name: "Blue", hex: "#3B82F6" },
  { name: "Green", hex: "#10B981" },
  { name: "Yellow", hex: "#F59E0B" },
  { name: "Orange", hex: "#F97316" },
  { name: "Purple", hex: "#A855F7" },
  { name: "Pink", hex: "#EC4899" },
  { name: "Gray", hex: "#6B7280" },
];

export function FilamentDialog({
  open,
  onOpenChange,
  onSave,
  editFilament,
  onShowQR,
}: FilamentDialogProps) {
  const isMobile = useIsMobile();
  const [formData, setFormData] = useState({
    name: "",
    material: "PLA",
    color: "Black",
    colorHex: "#000000",
    totalWeight: "1000",
    remainingWeight: "1000",
    manufacturer: "Hatchbox",
    diameter: "1.75",
    price: "",
  });

  useEffect(() => {
    if (editFilament) {
      setFormData({
        name: editFilament.name,
        material: editFilament.material,
        color: editFilament.color,
        colorHex: editFilament.colorHex,
        totalWeight: editFilament.totalWeight.toString(),
        remainingWeight: editFilament.remainingWeight.toString(),
        manufacturer: editFilament.manufacturer,
        diameter: editFilament.diameter.toString(),
        price: editFilament.price?.toString() || "",
      });
    } else {
      setFormData({
        name: "",
        material: "PLA",
        color: "Black",
        colorHex: "#000000",
        totalWeight: "1000",
        remainingWeight: "1000",
        manufacturer: "Hatchbox",
        diameter: "1.75",
        price: "",
      });
    }
  }, [editFilament, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const filamentData: Omit<Filament, "id"> = {
      name: formData.name,
      material: formData.material,
      color: formData.color,
      colorHex: formData.colorHex,
      totalWeight: parseInt(formData.totalWeight),
      remainingWeight: parseInt(formData.remainingWeight),
      manufacturer: formData.manufacturer,
      diameter: parseFloat(formData.diameter),
      price: formData.price ? parseFloat(formData.price) : undefined,
    };

    if (editFilament) {
      onSave({ ...filamentData, id: editFilament.id, favorite: editFilament.favorite });
    } else {
      onSave(filamentData);
    }

    onOpenChange(false);
  };

  const handleColorSelect = (colorName: string) => {
    const preset = COLOR_PRESETS.find((c) => c.name === colorName);
    if (preset) {
      setFormData({ ...formData, color: preset.name, colorHex: preset.hex });
    }
  };

  const formBody = (
    <>
      <div className="grid w-full min-w-0 gap-4 py-4">
        <div className="space-y-2 w-full min-w-0">
          <Label htmlFor="manufacturer">Brand</Label>
          <Select
            value={formData.manufacturer}
            onValueChange={(value) =>
              setFormData({ ...formData, manufacturer: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MANUFACTURERS.map((manufacturer) => (
                <SelectItem key={manufacturer} value={manufacturer}>
                  {manufacturer}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full min-w-0">
          <div className="space-y-2 min-w-0">
            <Label htmlFor="material">Material</Label>
            <Select
              value={formData.material}
              onValueChange={(value) =>
                setFormData({ ...formData, material: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MATERIALS.map((material) => (
                  <SelectItem key={material} value={material}>
                    {material}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          </div>
          <div className="space-y-2 min-w-0">
            <Label htmlFor="diameter">Diameter (mm)</Label>
            <Select
              value={formData.diameter}
              onValueChange={(value) =>
                setFormData({ ...formData, diameter: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DIAMETERS.map((diameter) => (
                  <SelectItem key={diameter} value={diameter}>
                    {diameter}mm
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2 w-full min-w-0">
          <Label>Color</Label>
          <div className="w-full min-w-0 overflow-hidden">
            <div className="flex flex-nowrap gap-1.5 overflow-x-auto pb-1 min-w-0 -mx-0.5">
            {COLOR_PRESETS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => handleColorSelect(preset.name)}
                className={`h-9 w-9 shrink-0 rounded-md border-2 transition-all ${
                  formData.color === preset.name
                    ? "border-[#F26D00] ring-2 ring-[#F26D00]/30"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                style={{ backgroundColor: preset.hex }}
                title={preset.name}
              >
                <span className="sr-only">{preset.name}</span>
              </button>
            ))}
            </div>
          </div>
          <div className="flex gap-2 mt-2 w-full min-w-0">
            <Input
              value={formData.color}
              onChange={(e) =>
                setFormData({ ...formData, color: e.target.value })
              }
              placeholder="Color name"
              className="flex-1 min-w-0 w-0"
            />
            <Input
              type="color"
              value={formData.colorHex}
              onChange={(e) =>
                setFormData({ ...formData, colorHex: e.target.value })
              }
              className="w-14 h-9 shrink-0 rounded-md cursor-pointer p-0.5 border border-input"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 w-full min-w-0">
          <div className="space-y-2 min-w-0">
            <Label htmlFor="totalWeight">Total Weight (g)</Label>
            <Input
              id="totalWeight"
              type="number"
              value={formData.totalWeight}
              onChange={(e) =>
                setFormData({ ...formData, totalWeight: e.target.value })
              }
              min="0"
              required
            />
          </div>
          <div className="space-y-2 min-w-0">
            <Label htmlFor="remainingWeight">Remaining (g)</Label>
            <Input
              id="remainingWeight"
              type="number"
              value={formData.remainingWeight}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  remainingWeight: e.target.value,
                })
              }
              min="0"
              max={formData.totalWeight}
              required
            />
          </div>
          <div className="space-y-2 min-w-0">
            <Label htmlFor="price">Price ($)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              min="0"
              placeholder="Optional"
            />
          </div>
        </div>

        <div className="space-y-2 w-full min-w-0">
          <Label htmlFor="name">Description</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            placeholder="e.g., Matte Black PLA"
            className="w-full min-w-0"
          />
        </div>
      </div>
    </>
  );

  const title = editFilament ? "Edit Filament" : "Add New Filament";
  const description = editFilament
    ? "Update the details of your filament spool."
    : "Add a new filament spool to your inventory.";

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[92vh] w-full max-w-full rounded-t-2xl border-t border-[#F26D00]/20 bg-white overflow-hidden [&>div:first-child]:!h-1.5 [&>div:first-child]:!w-9 [&>div:first-child]:!mt-3 [&>div:first-child]:!min-h-0 [&>div:first-child]:!min-w-0">
          <DrawerHeader className="pb-2 flex-shrink-0">
            <DrawerTitle className="text-xl text-gray-900">{title}</DrawerTitle>
            <DrawerDescription className="text-sm text-gray-500">
              {description}
            </DrawerDescription>
          </DrawerHeader>
          <form onSubmit={handleSubmit} className="flex flex-col min-h-0 min-w-0 flex-1">
            <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 pb-4 min-w-0">{formBody}</div>
            <DrawerFooter className="flex-row gap-2 border-t border-gray-100 pt-4 pb-6 px-4" style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1 rounded-xl border-gray-200"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 rounded-xl bg-[#F26D00] hover:bg-[#e56300] text-white"
              >
                {editFilament ? "Update" : "Add"} Filament
              </Button>
            </DrawerFooter>
          </form>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          {formBody}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {editFilament ? "Update" : "Add"} Filament
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}