import { useState, useEffect } from "react";
import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import type { Project } from "@/app/context/AppContext";

interface ProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (project: Omit<Project, "id"> | Project) => void;
  editProject?: Project | null;
}

export function ProjectDialog({
  open,
  onOpenChange,
  onSave,
  editProject,
}: ProjectDialogProps) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (editProject) {
      setName(editProject.name);
    } else {
      setName("");
    }
  }, [editProject, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    if (editProject) {
      onSave({ id: editProject.id, name: trimmed });
    } else {
      onSave({ name: trimmed });
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{editProject ? "Edit project" : "New project"}</DialogTitle>
            <DialogDescription>
              {editProject
                ? "Change the project name."
                : "Create a project to group related parts."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="project-name">Name</Label>
              <Input
                id="project-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Desk Organizer"
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim()}>
              {editProject ? "Save" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
