import { useQueries } from "@tanstack/react-query";
import { mockEntities } from "../services/mockEntities";
import { getPlacement } from "../services/placementApi";
import type { PlacementType } from "../types/placement";

export function usePlacements(columnId: string) {
  const queries = useQueries({
    queries: mockEntities.map((entity) => ({
      queryKey: ["placement", columnId, entity.id],
      queryFn: () => getPlacement(entity.id, [columnId]),
      enabled: !!columnId,
    })),
  });

  const placements = queries
    .map((query) => query.data)
    .filter(
      (placement): placement is PlacementType => placement != null,
    );

  const isLoading = queries.some((query) => query.isLoading);
  const isError = queries.some((query) => query.isError);

  return {
    placements,
    isLoading,
    isError,
  };
}