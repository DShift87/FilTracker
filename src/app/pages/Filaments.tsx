import { useState, useEffect, useCallback } from "react";
import { Package } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate, useLocation } from "react-router";
import { Button } from "@/app/components/ui/button";
import { FilamentCard } from "@/app/components/FilamentCard";
import { FilamentDialog } from "@/app/components/FilamentDialog";
import { FilamentQRDialog } from "@/app/components/FilamentQRDialog";
import { QRScannerDialog } from "@/app/components/QRScannerDialog";
import { useAddAction } from "@/app/context/AddActionContext";
import { useApp, Filament } from "@/app/context/AppContext";
import { PlusIcon } from "@/imports/plus-icon";
import { SearchIcon } from "@/imports/search-icon";
import { QrScannerIcon } from "@/imports/qr-scanner-icon";
import { NfcReaderIcon } from "@/imports/nfc-reader-icon";
import { FilterIcon } from "@/imports/filter-icon";
import { AllFilamentsIcon } from "@/imports/all-filaments-icon";
import { AllFilamentsIconOutlined } from "@/imports/all-filaments-icon-outlined";
import { LowStockIcon } from "@/imports/low-stock-icon";
import { LowStockIconOutlined } from "@/imports/low-stock-icon-outlined";
import { OutOfStockIcon } from "@/imports/out-of-stock-icon";
import { OutOfStockIconOutlined } from "@/imports/out-of-stock-icon-outlined";
import { Input } from "@/app/components/ui/input";

export function Filaments() {
  const navigate = useNavigate();
  const location = useLocation();
  const { filaments, addFilament, updateFilament, deleteFilament } = useApp();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFilament, setEditingFilament] = useState<Filament | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [selectedFilamentForQR, setSelectedFilamentForQR] = useState<Filament | null>(null);
  const [qrScannerOpen, setQrScannerOpen] = useState(false);
  const [stockFilter, setStockFilter] = useState<"all" | "low" | "out">("all");
  const { registerAddHandler, unregisterAddHandler } = useAddAction();

  const handleSaveFilament = (filamentData: Omit<Filament, "id"> | Filament) => {
    if ("id" in filamentData) {
      updateFilament(filamentData);
      setEditingFilament(null);
    } else {
      const newFilament = addFilament(filamentData);
      // Show QR code dialog after adding new filament
      if (newFilament) {
        setSelectedFilamentForQR(newFilament);
        setQrDialogOpen(true);
      }
    }
  };

  const handleFilamentClick = (filament: Filament) => {
    navigate(`/filaments/${filament.id}`);
  };

  const handleAddNew = useCallback(() => {
    setEditingFilament(null);
    setDialogOpen(true);
  }, []);

  useEffect(() => {
    registerAddHandler(handleAddNew);
    return unregisterAddHandler;
  }, [registerAddHandler, unregisterAddHandler, handleAddNew]);

  useEffect(() => {
    const state = location.state as { openAdd?: boolean; tab?: "all" | "low" | "out" } | null;
    if (state?.openAdd) {
      handleAddNew();
      navigate(location.pathname, { replace: true, state: {} });
    }
    if (state?.tab && ["all", "low", "out"].includes(state.tab)) {
      setStockFilter(state.tab);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, location.pathname, handleAddNew, navigate]);

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    if (searchOpen) {
      setSearchQuery("");
    }
  };

  // Filter filaments based on search query and stock tab
  const filteredFilaments = filaments.filter((filament) => {
    // Stock filter
    const percentageRemaining = (filament.remainingWeight / filament.totalWeight) * 100;
    const isOutOfStock = filament.remainingWeight === 0;
    const isLowStock = percentageRemaining < 25 && !isOutOfStock;

    if (stockFilter === "low" && !isLowStock) return false;
    if (stockFilter === "out" && !isOutOfStock) return false;

    // Search filter
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      filament.name.toLowerCase().includes(query) ||
      filament.material.toLowerCase().includes(query) ||
      filament.color.toLowerCase().includes(query) ||
      filament.manufacturer.toLowerCase().includes(query)
    );
  });

  const lowStockCount = filaments.filter((f) => {
    const pct = (f.remainingWeight / f.totalWeight) * 100;
    return pct < 25 && f.remainingWeight > 0;
  }).length;
  const outOfStockCount = filaments.filter((f) => f.remainingWeight === 0).length;

  return (
    <div className="p-4 space-y-4 max-w-md mx-auto pb-24">
      {/* Header */}
      <div className="pt-2 flex items-start justify-between gap-3">
        <div className="flex-shrink-0">
          <h1 className="text-3xl font-bold">Filaments</h1>
          <p className="text-sm text-muted-foreground">
            {filaments.length} spool{filaments.length !== 1 ? "s" : ""}
          </p>
        </div>
        {searchOpen ? (
          <div className="flex-1 flex items-center gap-2">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-12 h-12 rounded-full"
                autoFocus
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2"
                onClick={toggleSearch}
              >
                <SearchIcon />
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-1 flex-shrink-0">
            <Button variant="ghost" size="icon" onClick={toggleSearch}>
              <SearchIcon />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setQrScannerOpen(true)}
              aria-label="Scan QR code"
            >
              <QrScannerIcon />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => {}}>
              <NfcReaderIcon />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => {}}>
              <FilterIcon />
            </Button>
          </div>
        )}
      </div>

      {/* Stock Tabs - navbar style pill */}
      <div className="bg-white flex gap-[8px] items-center p-[4px] rounded-[999px] w-full">
        {(
          [
            { value: "all" as const, label: "All", count: filaments.length, Icon: AllFilamentsIcon },
            { value: "low" as const, label: "Low Stock", count: lowStockCount, Icon: LowStockIcon },
            { value: "out" as const, label: "Out of Stock", count: outOfStockCount, Icon: OutOfStockIcon },
          ] as const
        ).map((tab) => {
          const isActive = stockFilter === tab.value;
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => setStockFilter(tab.value)}
              className={`relative flex flex-1 min-w-0 items-center justify-center gap-1.5 py-2 px-1 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                isActive ? "text-[#F26D00]" : "text-[#7A7A7A] hover:text-gray-900"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="stock-tab-indicator"
                  className="absolute inset-0 rounded-full z-0 bg-orange-100"
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                  }}
                />
              )}
              <span className="relative z-[1] flex items-center gap-1.5 whitespace-nowrap">
                {tab.value === "all" ? (
                  isActive ? (
                    <AllFilamentsIcon className="h-4 w-4 shrink-0" />
                  ) : (
                    <AllFilamentsIconOutlined className="h-4 w-4 shrink-0" />
                  )
                ) : tab.value === "low" ? (
                  isActive ? (
                    <LowStockIcon className="h-4 w-4 shrink-0" />
                  ) : (
                    <LowStockIconOutlined className="h-4 w-4 shrink-0" />
                  )
                ) : (
                  isActive ? (
                    <OutOfStockIcon className="h-4 w-4 shrink-0" />
                  ) : (
                    <OutOfStockIconOutlined className="h-4 w-4 shrink-0" />
                  )
                )}
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filament List */}
      {filteredFilaments.length > 0 ? (
        <div className="space-y-3 pb-4">
          {filteredFilaments.map((filament) => (
            <FilamentCard
              key={filament.id}
              filament={filament}
              onClick={handleFilamentClick}
              onToggleFavorite={(f) => updateFilament({ ...f, favorite: !f.favorite })}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          {!searchQuery && stockFilter === "out" ? (
            <OutOfStockIconOutlined className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          ) : !searchQuery && stockFilter === "low" ? (
            <LowStockIconOutlined className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          ) : !searchQuery && stockFilter === "all" ? (
            <AllFilamentsIconOutlined className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          ) : (
            <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          )}
          <h3 className="font-semibold mb-2">
            {searchQuery
              ? "No filaments found"
              : stockFilter === "low"
                ? "No low stock spools"
                : stockFilter === "out"
                  ? "No out of stock spools"
                  : "No filaments found"}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {searchQuery
              ? "Try adjusting your search terms."
              : stockFilter !== "all"
                ? "All your filaments are in good shape."
                : "Get started by adding your first filament spool."}
          </p>
          {!searchQuery && stockFilter === "all" && (
            <Button onClick={handleAddNew}>
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Filament
            </Button>
          )}
        </div>
      )}

      {/* Dialog */}
      <FilamentDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            setEditingFilament(null);
          }
        }}
        onSave={handleSaveFilament}
        editFilament={editingFilament}
      />

      {/* QR Scanner - opens camera to scan filament QR */}
      <QRScannerDialog
        open={qrScannerOpen}
        onOpenChange={setQrScannerOpen}
        onScan={(filamentId) => {
          setQrScannerOpen(false);
          navigate(`/filaments/${filamentId}`);
        }}
      />

      {/* QR Dialog */}
      <FilamentQRDialog
        open={qrDialogOpen}
        onOpenChange={(open) => {
          setQrDialogOpen(open);
          if (!open) {
            setSelectedFilamentForQR(null);
          }
        }}
        filament={selectedFilamentForQR}
      />
    </div>
  );
}