import { useState, useEffect } from "react";
import { Button } from "@/app/components/ui/button";

export function PwaUpdatePrompt() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onNeedRefresh = () => setShow(true);
    window.addEventListener("pwa-need-refresh", onNeedRefresh);
    return () => window.removeEventListener("pwa-need-refresh", onNeedRefresh);
  }, []);

  const handleRefresh = () => {
    const update = (window as unknown as { __pwa_update?: () => void }).__pwa_update;
    if (update) {
      update();
      // Fallback: force reload so the new version loads (in case SW doesn't reload)
      setTimeout(() => window.location.reload(), 500);
    } else {
      window.location.reload();
    }
  };

  if (!show) return null;

  return (
    <div
      className="animate-in fade-in slide-in-from-top-4 duration-300 fixed left-4 right-4 top-0 z-[9999] mx-auto flex max-w-md items-center justify-between gap-2 border border-[#F26D00]/25 bg-orange-50/90 backdrop-blur-sm px-3 shadow-[0_4px_12px_rgba(242,109,0,0.12)] overflow-visible"
      style={{
        marginTop: "max(18px, env(safe-area-inset-top, 44px))",
        marginBottom: 18,
        paddingTop: 10,
        paddingBottom: 10,
        borderRadius: 12,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
      }}
    >
      <span className="text-sm font-semibold text-gray-800">Update available</span>
      <div className="flex gap-1.5">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 min-w-[44px] shrink-0 rounded-lg border-gray-200 bg-white px-3 text-xs text-gray-700 hover:bg-gray-50 touch-manipulation"
          onClick={() => setShow(false)}
        >
          Later
        </Button>
        <Button
          type="button"
          size="sm"
          className="h-8 min-w-[44px] shrink-0 rounded-lg bg-[#F26D00] px-3 text-xs text-white hover:bg-[#e56300] touch-manipulation"
          onClick={handleRefresh}
        >
          Refresh
        </Button>
      </div>
    </div>
  );
}
