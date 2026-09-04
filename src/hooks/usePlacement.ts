import { type QueryClient, useQuery } from "@tanstack/react-query";
import type { ColumnId, PlacementType } from "../types/placement";
import { getPlacementsByColumn } from "../services/placementApi";
import { placementKeys } from "../utils/queryKeys";

export function usePlacement(columnId: ColumnId) {
  return useQuery<PlacementType[]>({
    queryKey: placementKeys.byColumnId(columnId),
    queryFn: () => getPlacementsByColumn(columnId),
    
    enabled: !!columnId,
    staleTime: Infinity,
  });
}

export const invalidateColumnPlacements = (
  queryClient: QueryClient,
  columnId: ColumnId,
) => {
  queryClient.invalidateQueries({
    queryKey: placementKeys.byColumnId(columnId),
  });
};
