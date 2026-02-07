import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { PrintedPartCard } from "@/app/components/PrintedPartCard";
import { PrintedPartDialog } from "@/app/components/PrintedPartDialog";
import { ProjectDialog } from "@/app/components/ProjectDialog";
import { useApp, PrintedPart } from "@/app/context/AppContext";
import { ProjectsEmptyIcon } from "@/imports/projects-empty-icon";
import { PlusIcon } from "@/imports/plus-icon";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/app/components/ui/alert-dialog";

export function ProjectDetail() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const {
    printedParts,
    filaments,
    projects,
    addPrintedPart,
    updatePrintedPart,
    deletePrintedPart,
    updateProject,
    deleteProject,
  } = useApp();
  const [partDialogOpen, setPartDialogOpen] = useState(false);
  const [editingPart, setEditingPart] = useState<PrintedPart | null>(null);
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [deleteProjectOpen, setDeleteProjectOpen] = useState(false);

  const project = projects.find((p) => p.id === projectId);
  const projectParts = printedParts.filter((p) => p.projectId === projectId);

  if (!project) {
    return (
      <div
        className="flex items-center justify-center min-h-screen p-4"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Project not found</h2>
          <Button onClick={() => navigate("/parts")}>Back to parts</Button>
        </div>
      </div>
    );
  }

  const handleDeleteProject = () => {
    deleteProject(project.id);
    setDeleteProjectOpen(false);
    navigate("/parts");
  };

  return (
    <div
      className="min-h-screen bg-background pb-24"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="sticky top-0 z-10 bg-background border-b px-4 py-3 flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0"
          onClick={() => navigate("/parts")}
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="font-semibold text-lg truncate">{project.name}</h1>
          <p className="text-sm text-muted-foreground">
            {projectParts.length} part{projectParts.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setProjectDialogOpen(true)}
        >
          Edit
        </Button>
      </div>

      <div className="p-4 space-y-4">
        {projectParts.length > 0 ? (
          <div className="space-y-3">
            {projectParts.map((part) => {
              const filament = filaments.find((f) => f.id === part.filamentId);
              return (
                <PrintedPartCard
                  key={part.id}
                  part={part}
                  filamentName={filament?.name}
                  filamentColor={filament?.colorHex}
                  filamentPrice={filament?.price}
                  filamentTotalWeight={filament?.totalWeight}
                  onEdit={(p) => {
                    setEditingPart(p);
                    setPartDialogOpen(true);
                  }}
                  onDelete={deletePrintedPart}
                  onClick={(p) => navigate(`/parts/${p.id}`)}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <ProjectsEmptyIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">No parts in this project</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Add a part and assign it to this project.
            </p>
            <Button onClick={() => { setEditingPart(null); setPartDialogOpen(true); }}>
              <PlusIcon className="mr-2 h-4 w-4" />
              Add part
            </Button>
          </div>
        )}

        {projectParts.length > 0 && (
          <Button
            className="w-full"
            onClick={() => { setEditingPart(null); setPartDialogOpen(true); }}
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            Add part to project
          </Button>
        )}

        <Button
          variant="outline"
          className="w-full text-destructive border-destructive/50"
          onClick={() => setDeleteProjectOpen(true)}
        >
          Delete project
        </Button>
      </div>

      <PrintedPartDialog
        open={partDialogOpen}
        onOpenChange={(open) => {
          setPartDialogOpen(open);
          if (!open) setEditingPart(null);
        }}
        onSave={(partData) => {
          if ("id" in partData) {
            updatePrintedPart(partData);
          } else {
            addPrintedPart({ ...partData, projectId: project.id });
          }
          setPartDialogOpen(false);
          setEditingPart(null);
        }}
        editPart={editingPart}
        defaultProjectId={project.id}
      />

      <ProjectDialog
        open={projectDialogOpen}
        onOpenChange={setProjectDialogOpen}
        onSave={(data) => {
          if ("id" in data) updateProject(data);
        }}
        editProject={project}
      />

      <AlertDialog open={deleteProjectOpen} onOpenChange={setDeleteProjectOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete project?</AlertDialogTitle>
            <AlertDialogDescription>
              "{project.name}" will be removed. Parts in this project will not be deleted, but they will no longer be linked to a project.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProject} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
