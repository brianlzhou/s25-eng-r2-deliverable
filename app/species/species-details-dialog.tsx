"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import type { SpeciesWithAuthor } from "@/lib/types";
import Image from "next/image";
import { useState } from "react";
import EditSpeciesDialog from "./edit-species-dialog";

interface SpeciesDetailsDialogProps {
  species: SpeciesWithAuthor;
  sessionId: string;
}

export default function SpeciesDetailsDialog({ species, sessionId }: SpeciesDetailsDialogProps) {
  // Control open/closed state of the dialog
  const [open, setOpen] = useState<boolean>(false);
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);

  const isAuthor = species.author.id === sessionId;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mt-3 w-full">Learn More</Button>
      </DialogTrigger>
      <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">{species.scientific_name}</DialogTitle>
          {species.common_name && (
            <DialogDescription className="text-lg font-light italic">
              {species.common_name}
            </DialogDescription>
          )}
        </DialogHeader>

        {species.image && (
          <div className="relative h-60 w-full">
            <Image
              src={species.image}
              alt={species.scientific_name}
              fill
              style={{ objectFit: "cover" }}
              className="rounded-md"
            />
          </div>
        )}

        <div className="grid gap-4">
          <div>
            <h4 className="font-semibold">Kingdom</h4>
            <p>{species.kingdom}</p>
          </div>

          {species.total_population && (
            <div>
              <h4 className="font-semibold">Total Population</h4>
              <p>{species.total_population.toLocaleString()}</p>
            </div>
          )}

          {species.description && (
            <>
              <Separator />
              <div>
                <h4 className="font-semibold">Description</h4>
                <p className="whitespace-pre-wrap">{species.description}</p>
              </div>
            </>
          )}

          <Separator />

          <div>
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icons.user className="h-4 w-4" />
                <h4 className="font-semibold">Contributed by</h4>
              </div>
              {isAuthor && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditDialogOpen(true)}
                  className="h-8 w-8 p-0"
                >
                  <Icons.settings className="h-4 w-4" />
                </Button>
              )}
            </div>
            <p>{species.author.display_name}</p>
            {species.author.biography && (
              <p className="mt-2 text-sm text-muted-foreground">{species.author.biography}</p>
            )}
          </div>
        </div>
      </DialogContent>

      {/* Edit Dialog */}
      {isAuthor && (
        <EditSpeciesDialog
          species={species}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onSuccess={() => {
            setEditDialogOpen(false);
            setOpen(false);
          }}
        />
      )}
    </Dialog>
  );
}
