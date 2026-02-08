import { useState, useRef } from "react";
import { createWorker } from "tesseract.js";
import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { parseOcrText } from "@/app/lib/ocrParse";

export interface ScannedPartData {
  printTimeHours: number;
  printTimeMinutes: number;
  detectedPrice: number | null;
  notes: string;
}

interface ImageScanPartDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExtract: (data: ScannedPartData) => void;
}

export function ImageScanPartDialog({
  open,
  onOpenChange,
  onExtract,
}: ImageScanPartDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [parsed, setParsed] = useState<{
    printTimeMinutes: number | null;
    price: number | null;
    rawText: string;
  } | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !file.type.startsWith("image/")) return;

    setStatus("loading");
    setErrorMessage("");
    setParsed(null);
    setImagePreview(URL.createObjectURL(file));

    try {
      const worker = await createWorker("eng");
      const { data } = await worker.recognize(file);
      await worker.terminate();
      const result = parseOcrText(data.text);
      setParsed(result);
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Failed to read image");
    }
  };

  const handleCreatePart = () => {
    if (!parsed) return;
    const totalMins = parsed.printTimeMinutes ?? 0;
    const hours = Math.floor(totalMins / 60);
    const mins = totalMins % 60;
    const notes = parsed.price != null ? `Detected cost from image: $${parsed.price.toFixed(2)}` : "";
    onExtract({
      printTimeHours: hours,
      printTimeMinutes: mins,
      detectedPrice: parsed.price,
      notes,
    });
    onOpenChange(false);
    reset();
  };

  const reset = () => {
    setStatus("idle");
    setParsed(null);
    setErrorMessage("");
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) reset();
    onOpenChange(next);
  };

  const hasTime = parsed?.printTimeMinutes != null && parsed.printTimeMinutes > 0;
  const hasPrice = parsed?.price != null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Scan image for part info</DialogTitle>
          <DialogDescription>
            Upload a photo or screenshot (printer display, slicer, receipt) to extract print time and
            price.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <Button
            variant="outline"
            className="w-full"
            onClick={() => fileInputRef.current?.click()}
            disabled={status === "loading"}
          >
            {status === "loading" ? "Reading image…" : "Choose image from photos or files"}
          </Button>

          {imagePreview && (
            <div className="rounded-lg border overflow-hidden bg-muted/50">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full max-h-40 object-contain"
              />
            </div>
          )}

          {status === "loading" && (
            <p className="text-sm text-muted-foreground">Extracting text…</p>
          )}

          {status === "error" && (
            <p className="text-sm text-destructive">{errorMessage}</p>
          )}

          {status === "done" && parsed && (
            <div className="space-y-3">
              <div className="rounded-lg border p-3 space-y-2">
                <p className="text-sm font-medium">Detected:</p>
                <div className="flex flex-wrap gap-2">
                  {hasTime && (
                    <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                      Time: {Math.floor((parsed.printTimeMinutes ?? 0) / 60)}h{" "}
                      {(parsed.printTimeMinutes ?? 0) % 60}m
                    </span>
                  )}
                  {hasPrice && (
                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      Price: ${parsed.price!.toFixed(2)}
                    </span>
                  )}
                  {!hasTime && !hasPrice && (
                    <span className="text-sm text-muted-foreground">
                      No time or price found in image. You can still create a part manually.
                    </span>
                  )}
                </div>
              </div>
              <Button className="w-full" onClick={handleCreatePart}>
                Create part with this info
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
