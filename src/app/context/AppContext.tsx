import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";
import { isFirebaseConfigured } from "@/app/lib/firebase";
import { loadCloudData, saveCloudData, subscribeToCloudData } from "@/app/lib/cloudStorage";

export interface Filament {
  id: string;
  name: string;
  material: string;
  color: string;
  colorHex: string;
  totalWeight: number;
  remainingWeight: number;
  manufacturer: string;
  diameter: number;
  price?: number;
  favorite?: boolean;
}

export interface PrintedPart {
  id: string;
  name: string;
  filamentId: string;
  weightUsed: number;
  printTime: number; // in minutes
  printDate: string;
  notes?: string;
  imageUrl?: string;
}

interface AppContextType {
  filaments: Filament[];
  addFilament: (filament: Omit<Filament, "id">) => Filament;
  updateFilament: (filament: Filament) => void;
  deleteFilament: (id: string) => void;
  printedParts: PrintedPart[];
  addPrintedPart: (part: Omit<PrintedPart, "id">) => void;
  updatePrintedPart: (part: PrintedPart) => void;
  deletePrintedPart: (id: string) => void;
  isCloudSync: boolean;
  isCloudLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const SEED_FILAMENTS: Filament[] = [
  {
    id: "1",
    name: "Premium Black PLA",
    material: "PLA",
    color: "Black",
    colorHex: "#000000",
    totalWeight: 1000,
    remainingWeight: 750,
    manufacturer: "Hatchbox",
    diameter: 1.75,
    price: 19.99,
  },
  {
    id: "2",
    name: "Transparent PETG",
    material: "PETG",
    color: "Clear",
    colorHex: "#E0F2FE",
    totalWeight: 1000,
    remainingWeight: 200,
    manufacturer: "eSUN",
    diameter: 1.75,
    price: 24.99,
  },
  {
    id: "3",
    name: "Sky Blue PLA+",
    material: "PLA",
    color: "Blue",
    colorHex: "#3B82F6",
    totalWeight: 1000,
    remainingWeight: 950,
    manufacturer: "Polymaker",
    diameter: 1.75,
    price: 22.99,
  },
];

const SEED_PARTS: PrintedPart[] = [
  {
    id: "1",
    name: "Phone Stand",
    filamentId: "1",
    weightUsed: 45,
    printTime: 180,
    printDate: "2026-02-01",
    notes: "Printed at 0.2mm layer height",
  },
  {
    id: "2",
    name: "Cable Organizer",
    filamentId: "3",
    weightUsed: 28,
    printTime: 120,
    printDate: "2026-02-02",
  },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const useCloud = isFirebaseConfigured();
  const [filaments, setFilaments] = useState<Filament[]>(
    useCloud ? [] : SEED_FILAMENTS
  );
  const [printedParts, setPrintedParts] = useState<PrintedPart[]>(
    useCloud ? [] : SEED_PARTS
  );
  const [isCloudLoading, setIsCloudLoading] = useState(useCloud);

  useEffect(() => {
    if (!useCloud) return;
    let unsub: (() => void) | undefined;
    (async () => {
      try {
        const data = await loadCloudData();
        if (data) {
          setFilaments(data.filaments);
          setPrintedParts(data.printedParts);
        }
      } finally {
        setIsCloudLoading(false);
      }
      unsub = subscribeToCloudData((data) => {
        setFilaments(data.filaments);
        setPrintedParts(data.printedParts);
      });
    })();
    return () => {
      unsub?.();
    };
  }, [useCloud]);

  const persist = (f: Filament[], p: PrintedPart[]) => {
    if (!useCloud) return;
    saveCloudData({ filaments: f, printedParts: p }).catch((e) => {
      console.error("Cloud save failed:", e);
      toast.error("Cloud sync failed. Check console or Firestore rules.");
    });
  };

  const addFilament = (filamentData: Omit<Filament, "id">) => {
    const newFilament: Filament = {
      ...filamentData,
      id: Date.now().toString(),
      favorite: filamentData.favorite ?? false,
    };
    const next = [...filaments, newFilament];
    setFilaments(next);
    persist(next, printedParts);
    return newFilament;
  };

  const updateFilament = (filament: Filament) => {
    const next = filaments.map((f) => (f.id === filament.id ? filament : f));
    setFilaments(next);
    persist(next, printedParts);
  };

  const deleteFilament = (id: string) => {
    const next = filaments.filter((f) => f.id !== id);
    setFilaments(next);
    persist(next, printedParts);
  };

  const addPrintedPart = (partData: Omit<PrintedPart, "id">) => {
    const newPart: PrintedPart = {
      ...partData,
      id: Date.now().toString(),
    };
    const nextParts = [...printedParts, newPart];
    setPrintedParts(nextParts);

    // Update filament weight
    const filament = filaments.find((f) => f.id === partData.filamentId);
    if (filament) {
      const updated = {
        ...filament,
        remainingWeight: Math.max(0, filament.remainingWeight - partData.weightUsed),
      };
      const nextFilaments = filaments.map((f) =>
        f.id === updated.id ? updated : f
      );
      setFilaments(nextFilaments);
      persist(nextFilaments, nextParts);
    } else {
      persist(filaments, nextParts);
    }
  };

  const updatePrintedPart = (part: PrintedPart) => {
    const oldPart = printedParts.find((p) => p.id === part.id);
    const nextParts = printedParts.map((p) => (p.id === part.id ? part : p));

    let nextFilaments = filaments;
    if (oldPart) {
      if (oldPart.filamentId === part.filamentId) {
        const weightDiff = part.weightUsed - oldPart.weightUsed;
        const filament = filaments.find((f) => f.id === part.filamentId);
        if (filament) {
          const updated = {
            ...filament,
            remainingWeight: Math.max(0, filament.remainingWeight - weightDiff),
          };
          nextFilaments = filaments.map((f) =>
            f.id === updated.id ? updated : f
          );
        }
      } else {
        const oldFilament = filaments.find((f) => f.id === oldPart.filamentId);
        const newFilament = filaments.find((f) => f.id === part.filamentId);
        nextFilaments = filaments.map((f) => {
          if (f.id === oldPart.filamentId && oldFilament)
            return { ...f, remainingWeight: f.remainingWeight + oldPart.weightUsed };
          if (f.id === part.filamentId && newFilament)
            return { ...f, remainingWeight: Math.max(0, f.remainingWeight - part.weightUsed) };
          return f;
        });
      }
    }
    setPrintedParts(nextParts);
    setFilaments(nextFilaments);
    persist(nextFilaments, nextParts);
  };

  const deletePrintedPart = (id: string) => {
    const part = printedParts.find((p) => p.id === id);
    const nextParts = printedParts.filter((p) => p.id !== id);
    let nextFilaments = filaments;
    if (part) {
      const filament = filaments.find((f) => f.id === part.filamentId);
      if (filament) {
        nextFilaments = filaments.map((f) =>
          f.id === filament.id
            ? { ...f, remainingWeight: f.remainingWeight + part.weightUsed }
            : f
        );
      }
    }
    setPrintedParts(nextParts);
    setFilaments(nextFilaments);
    persist(nextFilaments, nextParts);
  };

  return (
    <AppContext.Provider
      value={{
        filaments,
        addFilament,
        updateFilament,
        deleteFilament,
        printedParts,
        addPrintedPart,
        updatePrintedPart,
        deletePrintedPart,
        isCloudSync: useCloud,
        isCloudLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}