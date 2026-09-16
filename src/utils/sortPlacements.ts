import type { PlacementType } from "../types/placement";

export function bySortKey(a: PlacementType, b: PlacementType): number {
  if (a.sortKey < b.sortKey) return -1;
  if (a.sortKey > b.sortKey) return 1;
  return 0;
}
