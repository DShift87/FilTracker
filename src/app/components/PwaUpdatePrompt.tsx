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
    if (update) update();
  };

  if (!show) return null;

  return (
    <div
      className="animate-in fade-in slide-in-from-top-4 duration-300 fixed left-4 right-4 top-0 z-[100] mx-auto flex max-w-md items-center justify-between gap-2 rounded-b-xl border border-[#F26D00]/25 bg-orange-50/90 backdrop-blur-sm px-3 shadow-[0_4px_12px_rgba(242,109,0,0.12)]"
      style={{
        paddingTop: 6,
        paddingBottom: 6,
        marginTop: "max(8px, env(safe-area-inset-top))",
      }}
    >
      <span className="text-sm font-semibold text-gray-800">Update available</span>
      <div className="flex gap-1.5">
        <Button
          variant="outline"
          size="sm"
          className="h-7 shrink-0 rounded-lg border-gray-200 bg-white px-2.5 text-xs text-gray-700 hover:bg-gray-50"
          onClick={() => setShow(false)}
        >
          Later
        </Button>
        <Button
          size="sm"
          className="h-7 shrink-0 rounded-lg bg-[#F26D00] px-2.5 text-xs text-white hover:bg-[#e56300]"
          onClick={handleRefresh}
        >
          Refresh
        </Button>
      </div>
    </div>
  );
}
