import { useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";
import { useNavigate, useLocation } from "react-router";
import { Button } from "@/app/components/ui/button";
import { PrintedPartCard } from "@/app/components/PrintedPartCard";
import { PrintedPartDialog } from "@/app/components/PrintedPartDialog";
import { ImageScanPartDialog } from "@/app/components/ImageScanPartDialog";
import { ProjectCard } from "@/app/components/ProjectCard";
import { ProjectDialog } from "@/app/components/ProjectDialog";
import { useAddAction } from "@/app/context/AddActionContext";
import { useApp, PrintedPart, Project } from "@/app/context/AppContext";
import { PlusIcon } from "@/imports/plus-icon";
import { SearchIcon } from "@/imports/search-icon";
import { AllPartsTabIcon } from "@/imports/all-parts-tab-icon";
import { ProjectsTabIcon } from "@/imports/projects-tab-icon";
import { QrScannerIcon } from "@/imports/qr-scanner-icon";
import { NfcReaderIcon } from "@/imports/nfc-reader-icon";
import { Input } from "@/app/components/ui/input";
import { RecentPrintsEmptyIcon } from "@/imports/recent-prints-empty-icon";
import { ProjectsEmptyIcon } from "@/imports/projects-empty-icon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

type PartsView = "all" | "projects";

export function PrintedParts() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    printedParts,
    filaments,
    projects,
    addPrintedPart,
    updatePrintedPart,
    deletePrintedPart,
    addProject,
    updateProject,
    deleteProject,
  } = useApp();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [imageScanOpen, setImageScanOpen] = useState(false);
  const [scannedInitialData, setScannedInitialData] = useState<{
    printTimeHours: number;
    printTimeMinutes: number;
    notes: string;
  } | null>(null);
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [editingPart, setEditingPart] = useState<PrintedPart | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [view, setView] = useState<PartsView>("all");
  const [filterFilament, setFilterFilament] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("date");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { registerAddHandler, unregisterAddHandler } = useAddAction();

  // When returning from a project, show the Projects tab
  useEffect(() => {
    if (location.state?.view === "projects") {
      setView("projects");
    }
  }, [location.state]);

  const handleSavePart = (partData: Omit<PrintedPart, "id"> | PrintedPart) => {
    if ("id" in partData) {
      updatePrintedPart(partData);
      setEditingPart(null);
    } else {
      addPrintedPart(partData);
    }
  };

  const handleSaveProject = (projectData: Omit<Project, "id"> | Project) => {
    if ("id" in projectData) {
      updateProject(projectData);
      setEditingProject(null);
    } else {
      addProject(projectData);
    }
    setProjectDialogOpen(false);
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

  const partCountByProject = (projectId: string) =>
    printedParts.filter((p) => p.projectId === projectId).length;

  const totalCostByProject = (projectId: string): number | null => {
    const parts = printedParts.filter((p) => p.projectId === projectId);
    let total = 0;
    let hasAnyCost = false;
    for (const part of parts) {
      const filament = filaments.find((f) => f.id === part.filamentId);
      if (filament?.price != null && filament?.totalWeight != null) {
        total += (filament.price / filament.totalWeight) * part.weightUsed;
        hasAnyCost = true;
      }
    }
    return hasAnyCost ? total : null;
  };

  return (
    <div className="p-4 space-y-4 max-w-md mx-auto pb-24">
      {/* Header */}
      <div className="pt-2 flex items-start justify-between gap-3">
        <div className="flex-shrink-0">
          <h1 className="text-3xl font-bold">Printed Parts</h1>
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
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setImageScanOpen(true)}
              aria-label="Scan image for part info"
            >
              <QrScannerIcon />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => {}}>
              <NfcReaderIcon />
            </Button>
          </div>
        )}
      </div>

      {/* View tabs: All Parts | Projects */}
      <div className="bg-white flex gap-[8px] items-center p-[4px] rounded-xl w-full shadow-[0_-2px_10px_rgba(0,0,0,0.06),0_2px_10px_rgba(0,0,0,0.06)]">
        <button
          type="button"
          onClick={() => setView("all")}
          className={`relative flex-1 min-w-0 py-2 px-3 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-1.5 ${
            view === "all" ? "text-[#F26D00]" : "text-[#7A7A7A] hover:text-gray-900"
          }`}
        >
          {view === "all" && (
            <span className="absolute inset-0 rounded-[10px] bg-orange-100 z-0" />
          )}
          <span className="relative z-[1] flex items-center gap-1.5 shrink-0">
            <AllPartsTabIcon className="h-4 w-4" active={view === "all"} />
            All parts
          </span>
        </button>
        <button
          type="button"
          onClick={() => setView("projects")}
          className={`relative flex-1 min-w-0 py-2 px-3 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-1.5 ${
            view === "projects" ? "text-[#F26D00]" : "text-[#7A7A7A] hover:text-gray-900"
          }`}
        >
          {view === "projects" && (
            <span className="absolute inset-0 rounded-[10px] bg-orange-100 z-0" />
          )}
          <span className="relative z-[1] flex items-center gap-1.5 shrink-0">
            <ProjectsTabIcon className="h-4 w-4" active={view === "projects"} />
            Projects
          </span>
        </button>
      </div>

      {view === "projects" ? (
        <>
          {projects.length > 0 ? (
            <div className="space-y-3 pb-4">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  partCount={partCountByProject(project.id)}
                  totalCost={totalCostByProject(project.id)}
                  onClick={() => navigate(`/parts/project/${project.id}`)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ProjectsEmptyIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">No projects yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create a project to group related parts together.
              </p>
              <Button onClick={() => { setEditingProject(null); setProjectDialogOpen(true); }}>
                <PlusIcon className="mr-2 h-4 w-4" />
                New project
              </Button>
            </div>
          )}
          {projects.length > 0 && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => { setEditingProject(null); setProjectDialogOpen(true); }}
            >
              <PlusIcon className="mr-2 h-4 w-4" />
              New project
            </Button>
          )}
        </>
      ) : null}

      {view === "all" && (
      <>
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
                      className="w-3 h-3 rounded border border-[#E5E5E5]"
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
      </>
      )}

      {/* Part Dialog */}
      <PrintedPartDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            setEditingPart(null);
            setScannedInitialData(null);
          }
        }}
        onSave={handleSavePart}
        editPart={editingPart}
        initialData={scannedInitialData ?? undefined}
      />
      <ImageScanPartDialog
        open={imageScanOpen}
        onOpenChange={setImageScanOpen}
        onExtract={(data) => {
          setScannedInitialData({
            printTimeHours: data.printTimeHours,
            printTimeMinutes: data.printTimeMinutes,
            notes: data.notes,
          });
          setImageScanOpen(false);
          setEditingPart(null);
          setDialogOpen(true);
        }}
      />
      {/* Project Dialog */}
      <ProjectDialog
        open={projectDialogOpen}
        onOpenChange={(open) => {
          setProjectDialogOpen(open);
          if (!open) setEditingProject(null);
        }}
        onSave={handleSaveProject}
        editProject={editingProject}
      />
    </div>
  );
}