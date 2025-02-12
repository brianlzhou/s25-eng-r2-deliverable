"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "@/lib/hooks/use-debounce";

interface SearchFilters {
  scientificName: boolean;
  commonName: boolean;
  description: boolean;
}

interface SearchSectionProps {
  onSearchChange: (search: string, filters: SearchFilters) => void;
  totalResults: number;
}

export default function SearchSection({ onSearchChange, totalResults }: SearchSectionProps) {
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState<SearchFilters>({
    scientificName: true,
    commonName: true,
    description: true,
  });

  const debouncedSearch = useDebounce(searchText, 300);

  useEffect(() => {
    onSearchChange(debouncedSearch, filters);
  }, [debouncedSearch, filters, onSearchChange]);

  const handleFilterChange = useCallback((key: keyof SearchFilters) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search species..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="pl-9"
        />
      </div>
      <div className="flex flex-wrap gap-6">
        <div className="flex items-center space-x-2">
          <Switch
            id="scientific-name"
            checked={filters.scientificName}
            onCheckedChange={() => handleFilterChange("scientificName")}
          />
          <Label htmlFor="scientific-name">Scientific Name</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="common-name"
            checked={filters.commonName}
            onCheckedChange={() => handleFilterChange("commonName")}
          />
          <Label htmlFor="common-name">Common Name</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="description"
            checked={filters.description}
            onCheckedChange={() => handleFilterChange("description")}
          />
          <Label htmlFor="description">Description</Label>
        </div>
        <div className="ml-auto text-sm text-muted-foreground">
          {totalResults} {totalResults === 1 ? "result" : "results"}
        </div>
      </div>
    </div>
  );
}
