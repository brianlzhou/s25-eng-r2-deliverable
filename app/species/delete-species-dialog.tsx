"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { createBrowserSupabaseClient } from "@/lib/client-utils";
import type { SpeciesWithAuthor } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface DeleteSpeciesDialogProps {
  species: SpeciesWithAuthor;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function DeleteSpeciesDialog({ species, open, onOpenChange, onSuccess }: DeleteSpeciesDialogProps) {
  const router = useRouter();
  const [confirmationText, setConfirmationText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirmationText !== species.scientific_name) return;

    setIsDeleting(true);
    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase.from("species").delete().eq("id", species.id);

    setIsDeleting(false);

    if (error) {
      return toast({
        title: "Something went wrong.",
        description: error.message,
        variant: "destructive",
      });
    }

    onSuccess();
    router.refresh();

    return toast({
      title: "Species deleted",
      description: `Successfully deleted ${species.scientific_name}.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Species</DialogTitle>
          <DialogDescription className="pt-4">
            This action cannot be undone. This will permanently delete{" "}
            <span className="font-medium">{species.scientific_name}</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Label htmlFor="confirmation">
            Please type <span className="font-medium">{species.scientific_name}</span> to confirm
          </Label>
          <Input
            id="confirmation"
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
            className="mt-2"
            placeholder="Type the scientific name to confirm"
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => void handleDelete()}
            disabled={confirmationText !== species.scientific_name || isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Species"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
