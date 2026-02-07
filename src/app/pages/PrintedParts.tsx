import { useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";
import { useNavigate, useLocation } from "react-router";
import { Button } from "@/app/components/ui/button";
import { PrintedPartCard } from "@/app/components/PrintedPartCard";
import { PrintedPartDialog } from "@/app/components/PrintedPartDialog";
import { useAddAction } from "@/app/context/AddActionContext";
import { useApp, PrintedPart } from "@/app/context/AppContext";
import { PlusIcon } from "@/imports/plus-icon";
import { SearchIcon } from "@/imports/search-icon";
import { QrScannerIcon } from "@/imports/qr-scanner-icon";
import { NfcReaderIcon } from "@/imports/nfc-reader-icon";
import { Input } from "@/app/components/ui/input";
import { RecentPrintsEmptyIcon } from "@/imports/recent-prints-empty-icon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

export function PrintedParts() {
  const navigate = useNavigate();
  const location = useLocation();
  const { printedParts, filaments, addPrintedPart, updatePrintedPart, deletePrintedPart } =
    useApp();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPart, setEditingPart] = useState<PrintedPart | null>(null);
  const [filterFilament, setFilterFilament] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("date");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { registerAddHandler, unregisterAddHandler } = useAddAction();

  const handleSavePart = (partData: Omit<PrintedPart, "id"> | PrintedPart) => {
    if ("id" in partData) {
      updatePrintedPart(partData);
      setEditingPart(null);
    } else {
      addPrintedPart(partData);
    }
  };

  const handleEditPart = (part: PrintedPart) => {
    setEditingPart(part);
    setDialogOpen(true);
  };

  const handleAddNew = useCallback(() => {
    setEditingPart(null);
    setDialogOpen(true);
  }, []);

  useEffect(() => {
    registerAddHandler(handleAddNew);
    return unregisterAddHandler;
  }, [registerAddHandler, unregisterAddHandler, handleAddNew]);

  useEffect(() => {
    if ((location.state as { openAdd?: boolean })?.openAdd) {
      handleAddNew();
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, location.pathname, handleAddNew, navigate]);

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    if (searchOpen) {
      setSearchQuery("");
    }
  };

  // Filter by search query
  let filteredParts = printedParts.filter((part) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const filament = filaments.find((f) => f.id === part.filamentId);
    return (
      part.name.toLowerCase().includes(query) ||
      (part.notes && part.notes.toLowerCase().includes(query)) ||
      (filament?.name.toLowerCase().includes(query)) ||
      (filament?.material.toLowerCase().includes(query)) ||
      (filament?.color.toLowerCase().includes(query))
    );
  });

  // Filter by filament
  if (filterFilament !== "all") {
    filteredParts = filteredParts.filter((p) => p.filamentId === filterFilament);
  }

  // Sort
  filteredParts = [...filteredParts].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "date":
        return new Date(b.printDate).getTime() - new Date(a.printDate).getTime();
      case "weight":
        return b.weightUsed - a.weightUsed;
      case "time":
        return b.printTime - a.printTime;
      default:
        return 0;
    }
  });

  // Calculate total stats
  const totalWeight = printedParts.reduce((sum, p) => sum + p.weightUsed, 0);
  const totalTime = printedParts.reduce((sum, p) => sum + p.printTime, 0);
  const totalHours = Math.floor(totalTime / 60);

  return (
    <div className="p-4 space-y-4 max-w-md mx-auto pb-24">
      {/* Header */}
      <div className="pt-2 flex items-start justify-between gap-3">
        <div className="flex-shrink-0">
          <h1 className="text-2xl font-bold">Printed Parts</h1>
          <p className="text-sm text-muted-foreground">
            {printedParts.length} part{printedParts.length !== 1 ? "s" : ""} • {totalWeight}g
            used • {totalHours}h
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
            <Button variant="ghost" size="icon" onClick={() => {}}>
              <QrScannerIcon />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => {}}>
              <NfcReaderIcon />
            </Button>
          </div>
        )}
      </div>

      {false && (
        <div className="space-y-2">
          <Select value={filterFilament} onValueChange={setFilterFilament}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by filament" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Filaments</SelectItem>
              {filaments.map((filament) => (
                <SelectItem key={filament.id} value={filament.id}>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded"
                      style={{ backgroundColor: filament.colorHex }}
                    />
                    {filament.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date (Newest)</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="weight">Weight Used</SelectItem>
              <SelectItem value="time">Print Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Parts List */}
      {filteredParts.length > 0 ? (
        <div className="space-y-3 pb-4">
          {filteredParts.map((part) => {
            const filament = filaments.find((f) => f.id === part.filamentId);
            return (
              <PrintedPartCard
                key={part.id}
                part={part}
                filamentName={filament?.name}
                filamentColor={filament?.colorHex}
                filamentPrice={filament?.price}
                filamentTotalWeight={filament?.totalWeight}
                onEdit={handleEditPart}
                onDelete={deletePrintedPart}
                onClick={(part) => navigate(`/parts/${part.id}`)}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <RecentPrintsEmptyIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-semibold mb-2">No parts found</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {filterFilament !== "all"
              ? "No parts match the selected filter."
              : "Start tracking your 3D printed parts."}
          </p>
          <Button onClick={handleAddNew}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Part
          </Button>
        </div>
      )}

      {/* Dialog */}
      <PrintedPartDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            setEditingPart(null);
          }
        }}
        onSave={handleSavePart}
        editPart={editingPart}
      />
    </div>
  );
}