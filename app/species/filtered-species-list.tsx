"use client";

import { Button } from "@/components/ui/button";
import type { SpeciesWithAuthor } from "@/lib/types";
import SpeciesCard from "./species-card";

interface SearchFilters {
  scientificName: boolean;
  commonName: boolean;
  description: boolean;
}

interface FilteredSpeciesListProps {
  species: SpeciesWithAuthor[];
  searchText: string;
  filters: SearchFilters;
  sessionId: string;
  onClear: () => void;
}

export default function FilteredSpeciesList({
  species,
  searchText,
  filters,
  sessionId,
  onClear,
}: FilteredSpeciesListProps) {
  const searchLower = searchText.toLowerCase();

  const filteredSpecies = searchText
    ? species.filter((species) => {
        // If any enabled filter matches, include the species
        if (
          filters.scientificName &&
          species.scientific_name.toLowerCase().includes(searchLower)
        ) {
          return true;
        }

        if (
          filters.commonName &&
          species.common_name?.toLowerCase().includes(searchLower)
        ) {
          return true;
        }

        if (
          filters.description &&
          species.description?.toLowerCase().includes(searchLower)
        ) {
          return true;
        }

        return false;
      })
    : species;

  if (searchText && filteredSpecies.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <p className="text-lg font-medium">No species found</p>
        <p className="text-sm text-muted-foreground">
          Try adjusting your search or filters to find what you&apos;re looking for.
        </p>
        <Button variant="outline" onClick={onClear}>
          Clear Search
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center">
      {filteredSpecies.map((species) => (
        <SpeciesCard
          key={species.id}
          species={species}
          sessionId={sessionId}
          searchHighlight={searchText}
          searchFilters={filters}
        />
      ))}
    </div>
  );
}
