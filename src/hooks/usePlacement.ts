import { type QueryClient, useQuery } from "@tanstack/react-query";
import type { PlacementType } from "../types/placement";
import { getPlacementsByColumn } from "../services/placementApi";
import { placementKeys } from "../utils/queryKeys";

export function usePlacement(columnId: string, boardId: string) {
  return useQuery<PlacementType[]>({
    queryKey: placementKeys.byColumnId(columnId),
    queryFn: () => getPlacementsByColumn(columnId, boardId),

    enabled: !!columnId && !!boardId,
    staleTime: Infinity,
  });
}

export const invalidateColumnPlacements = (
  queryClient: QueryClient,
  columnIds: string[],
) => {
  columnIds.forEach((id) =>
    queryClient.invalidateQueries({
      queryKey: placementKeys.byColumnId(id),
    }),
  );
};
