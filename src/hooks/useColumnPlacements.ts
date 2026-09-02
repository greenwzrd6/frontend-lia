import { useQueries } from "@tanstack/react-query";
import { getPlacement } from "../services/placementApi";
import { mockEntities } from "../services/mockEntities";
import type { PlacementType } from "../types/placement";

export function useColumnPlacements(columnId: string) {
  return useQueries({
    queries: mockEntities.map((entity) => ({
      queryKey: ["placement", columnId, entity.id],
      queryFn: () => getPlacement(entity.id, [columnId]),
    })),
  })
    .map((query) => query.data)
    .filter((p): p is PlacementType => p !== null);
}