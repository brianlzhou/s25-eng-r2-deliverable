"use client";
/*
Note: "use client" is a Next.js App Router directive that tells React to render the component as
a client component rather than a server component. This establishes the server-client boundary,
providing access to client-side functionality such as hooks and event handlers to this component and
any of its imported children. Although the SpeciesCard component itself does not use any client-side
functionality, it is beneficial to move it to the client because it is rendered in a list with a unique
key prop in species/page.tsx. When multiple component instances are rendered from a list, React uses the unique key prop
on the client-side to correctly match component state and props should the order of the list ever change.
React server components don't track state between rerenders, so leaving the uniquely identified components (e.g. SpeciesCard)
can cause errors with matching props and state in child components if the list order changes.
*/
import type { SpeciesWithAuthor } from "@/lib/types";
import { cn } from "@/lib/utils";
import Image from "next/image";
import SpeciesDetailsDialog from "./species-details-dialog";

interface SearchFilters {
  scientificName: boolean;
  commonName: boolean;
  description: boolean;
}

interface SpeciesCardProps {
  species: SpeciesWithAuthor;
  sessionId: string;
  searchHighlight?: string;
  searchFilters?: SearchFilters;
}

function highlightText(text: string, highlight: string, enabled: boolean) {
  if (!highlight || !enabled) return text;

  const parts = text.split(new RegExp(`(${highlight})`, "gi"));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <mark key={i} className="bg-yellow-200 rounded px-0.5">
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  );
}

export default function SpeciesCard({ species, sessionId, searchHighlight, searchFilters }: SpeciesCardProps) {
  return (
    <div className="m-4 w-72 min-w-72 flex-none rounded border-2 p-3 shadow">
      {species.image && (
        <div className="relative h-40 w-full">
          <Image src={species.image} alt={species.scientific_name} fill style={{ objectFit: "cover" }} />
        </div>
      )}
      <h3 className="mt-3 text-2xl font-semibold">
        {highlightText(species.scientific_name, searchHighlight ?? "", searchFilters?.scientificName ?? false)}
      </h3>
      <h4 className="text-lg font-light italic">
        {highlightText(species.common_name ?? "", searchHighlight ?? "", searchFilters?.commonName ?? false)}
      </h4>
      <p>
        {species.description
          ? highlightText(
              species.description.slice(0, 150).trim() + "...",
              searchHighlight ?? "",
              searchFilters?.description ?? false,
            )
          : ""}
      </p>
      <SpeciesDetailsDialog species={species} sessionId={sessionId} />
    </div>
  );
}
