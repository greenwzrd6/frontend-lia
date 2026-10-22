import type { PlacementType } from "../types/placement";

/** Comparator ordering placements ascending by their string `sortKey`. */
export function bySortKey(a: PlacementType, b: PlacementType): number {
  if (a.sortKey < b.sortKey) return -1;
  if (a.sortKey > b.sortKey) return 1;
  return 0;
}
