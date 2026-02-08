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
      className="fixed left-4 right-4 top-0 z-[100] mx-auto flex max-w-md items-center justify-between gap-3 rounded-b-2xl border border-[#F26D00]/25 bg-orange-50/90 backdrop-blur-sm px-4 py-3 shadow-[0_4px_12px_rgba(242,109,0,0.12)]"
      style={{
        paddingTop: "max(12px, env(safe-area-inset-top))",
        marginTop: "max(12px, env(safe-area-inset-top))",
      }}
    >
      <span className="text-sm font-medium text-gray-800">Update available</span>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="shrink-0 rounded-xl border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
          onClick={() => setShow(false)}
        >
          Later
        </Button>
        <Button
          size="sm"
          className="shrink-0 rounded-xl bg-[#F26D00] text-white hover:bg-[#e56300]"
          onClick={handleRefresh}
        >
          Refresh
        </Button>
      </div>
    </div>
  );
}
