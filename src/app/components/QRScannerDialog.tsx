import { useEffect, useRef, useId } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";

interface QRScannerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onScan: (filamentId: string) => void;
}

export function QRScannerDialog({
  open,
  onOpenChange,
  onScan,
}: QRScannerDialogProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerId = `qr-scanner-${useId().replace(/:/g, "")}`;

  useEffect(() => {
    if (!open) return;

    const startCamera = async () => {
      const element = document.getElementById(containerId);
      if (!element) return;

      try {
        const scanner = new Html5Qrcode(containerId);
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            try {
              const data = JSON.parse(decodedText) as { id?: string };
              if (data && typeof data.id === "string") {
                scanner.stop().catch(() => {});
                scannerRef.current = null;
                onOpenChange(false);
                onScan(data.id);
              }
            } catch {
              // Not our filament JSON, ignore or could show toast
            }
          },
          () => {}
        );
      } catch (err) {
        console.error("QR scanner start failed:", err);
        toast.error("Could not open camera. Check permission or try again.");
        onOpenChange(false);
      }
    };

    const t = setTimeout(startCamera, 100);

    return () => {
      clearTimeout(t);
      const s = scannerRef.current;
      if (s) {
        scannerRef.current = null;
        s.stop().then(() => s.clear()).catch(() => {});
      }
    };
  }, [open, containerId, onScan, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[min(400px,90vw)]" bottomSheet>
        <DialogHeader>
          <DialogTitle>Scan filament QR code</DialogTitle>
          <DialogDescription>
            Point your camera at a filament spool QR code to open it.
          </DialogDescription>
        </DialogHeader>
        <div
          id={containerId}
          className="rounded-lg overflow-hidden bg-black min-h-[240px] w-full"
        />
        <Button
          variant="outline"
          className="w-full"
          onClick={() => onOpenChange(false)}
        >
          Cancel
        </Button>
      </DialogContent>
    </Dialog>
  );
}
