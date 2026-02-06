import { useState } from "react";
import { Package, X } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "@/app/components/ui/button";
import { FilamentCard } from "@/app/components/FilamentCard";
import { FilamentDialog } from "@/app/components/FilamentDialog";
import { FilamentQRDialog } from "@/app/components/FilamentQRDialog";
import { QRScannerDialog } from "@/app/components/QRScannerDialog";
import { AddFab } from "@/app/components/AddFab";
import { useApp, Filament } from "@/app/context/AppContext";
import { PlusIcon } from "@/imports/plus-icon";
import { SearchIcon } from "@/imports/search-icon";
import { QrScannerIcon } from "@/imports/qr-scanner-icon";
import { NfcReaderIcon } from "@/imports/nfc-reader-icon";
import { FilterIcon } from "@/imports/filter-icon";
import { Input } from "@/app/components/ui/input";

export function Filaments() {
  const navigate = useNavigate();
  const { filaments, addFilament, updateFilament, deleteFilament } = useApp();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFilament, setEditingFilament] = useState<Filament | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [selectedFilamentForQR, setSelectedFilamentForQR] = useState<Filament | null>(null);
  const [qrScannerOpen, setQrScannerOpen] = useState(false);

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

  const handleAddNew = () => {
    setEditingFilament(null);
    setDialogOpen(true);
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    if (searchOpen) {
      setSearchQuery("");
    }
  };

  // Filter filaments based on search query
  const filteredFilaments = filaments.filter((filament) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      filament.name.toLowerCase().includes(query) ||
      filament.material.toLowerCase().includes(query) ||
      filament.color.toLowerCase().includes(query) ||
      filament.manufacturer.toLowerCase().includes(query)
    );
  });

  return (
    <div className="p-4 space-y-4 max-w-md mx-auto pb-24">
      {/* Header */}
      <div className="pt-2 flex items-start justify-between gap-3">
        <div className="flex-shrink-0">
          <h1 className="text-2xl font-bold">Filaments</h1>
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

      {/* Filament List */}
      {filteredFilaments.length > 0 ? (
        <div className="space-y-3 pb-4">
          {filteredFilaments.map((filament) => (
            <FilamentCard
              key={filament.id}
              filament={filament}
              onClick={handleFilamentClick}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-semibold mb-2">
            {searchQuery ? "No filaments found" : "No filaments found"}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {searchQuery
              ? "Try adjusting your search terms."
              : "Get started by adding your first filament spool."}
          </p>
          {!searchQuery && (
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

      <AddFab onClick={handleAddNew} />
    </div>
  );
}