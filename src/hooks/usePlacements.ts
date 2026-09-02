import { useQuery } from "@tanstack/react-query";
import { mockEntities } from "../services/mockEntities";
import { getPlacement } from "../services/placementApi";
import type { PlacementType } from "../types/placement";

export function usePlacements(columnIds: string[]) {
  return useQuery<PlacementType[]>({
    queryKey: ["placements", columnIds],
    queryFn: async () => {
      const placements = await Promise.all(
        mockEntities.map((entity) =>
          getPlacement(entity.id, columnIds),
        ),
      );

      return placements.filter(
        (placement): placement is PlacementType => placement != null,
      );
    },
    enabled: columnIds.length > 0,
  });
}