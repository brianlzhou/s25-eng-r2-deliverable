"use client";

import { Separator } from "@/components/ui/separator";
import type { SpeciesWithAuthor } from "@/lib/types";
import { useCallback, useState } from "react";
import FilteredSpeciesList from "./filtered-species-list";
import SearchSection from "./search-section";

interface SearchFilters {
  scientificName: boolean;
  commonName: boolean;
  description: boolean;
}

interface SpeciesContainerProps {
  species: SpeciesWithAuthor[];
  sessionId: string;
}

export default function SpeciesContainer({ species, sessionId }: SpeciesContainerProps) {
  const [searchText, setSearchText] = useState("");
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    scientificName: true,
    commonName: true,
    description: true,
  });

  const handleSearchChange = useCallback((search: string, filters: SearchFilters) => {
    setSearchText(search);
    setSearchFilters(filters);
  }, []);

  const handleClear = useCallback(() => {
    setSearchText("");
    setSearchFilters({
      scientificName: true,
      commonName: true,
      description: true,
    });
  }, []);

  const searchLower = searchText.toLowerCase();
  const filteredSpecies = searchText
    ? species.filter((species) => {
        // If any enabled filter matches, include the species
        if (
          searchFilters.scientificName &&
          species.scientific_name.toLowerCase().includes(searchLower)
        ) {
          return true;
        }

        if (
          searchFilters.commonName &&
          species.common_name?.toLowerCase().includes(searchLower)
        ) {
          return true;
        }

        if (
          searchFilters.description &&
          species.description?.toLowerCase().includes(searchLower)
        ) {
          return true;
        }

        return false;
      })
    : species;

  return (
    <>
      <SearchSection onSearchChange={handleSearchChange} totalResults={filteredSpecies.length} />
      <Separator className="my-4" />
      <FilteredSpeciesList
        species={filteredSpecies}
        searchText={searchText}
        filters={searchFilters}
        sessionId={sessionId}
        onClear={handleClear}
      />
    </>
  );
}
