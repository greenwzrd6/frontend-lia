import { QueryClient, useQuery } from "@tanstack/react-query";
import { getPlacements } from "../services/placementApi";
import type { PlacementType } from "../types/placement";

export function usePlacements(boardId: string) {
  console.log("usePlacements:", boardId);

  return useQuery<PlacementType[]>({
    queryKey: ["placements", boardId],
    queryFn: () => getPlacements(boardId),
    enabled: !!boardId,
  });
}

export const updatePlacementCache = (
  queryClient: QueryClient,
  boardId: string,
  updatedPlacements: PlacementType[],
) => {
  queryClient.setQueryData<PlacementType[]>(
    ["placements", boardId],
    (oldPlacements = []) => {
      const updatedIds = new Set(
        updatedPlacements.map((placement) => placement.entityId),
      );

      return [
        ...oldPlacements.filter(
          (placement) => !updatedIds.has(placement.entityId),
        ),
        ...updatedPlacements,
      ];
    },
  );
};

export const invalidateAllPlacements = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({
    queryKey: ["placements"],
  });
};
