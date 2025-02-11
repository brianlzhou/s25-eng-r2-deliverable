import type { Database } from "./schema";

type Species = Database["public"]["Tables"]["species"]["Row"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export type SpeciesWithAuthor = Omit<Species, "author"> & {
  author: Pick<Profile, "display_name" | "biography">;
};
