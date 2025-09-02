"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { AddProjectForm } from "@/components/add-project-form";
import { Plus } from "lucide-react";

export function AddProjectDialog() {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    // Close the dialog after successful project creation
    setTimeout(() => {
      setOpen(false);
    }, 2000); // Give time to show success message
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Add Project
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <AddProjectForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}
