import { useQuery } from "@tanstack/react-query";
import type { ColumnType } from "../types/column";
import { getPlacementsByColumn } from "../services/placementApi";
import { placementKeys } from "../utils/queryKeys";
interface QueryOptions {
  enabled?: boolean;
  staleTime?: number;
}
export function useColumn(
  column: ColumnType,
  boardId: string,
  options?: QueryOptions,
) {
  return useQuery({
    queryKey: placementKeys.byColumnId(column.id),
    queryFn: async () => {
      const result = await getPlacementsByColumn(column.id, boardId);
      const sorted = result.sort((a, b) => {
        if (a.sortKey < b.sortKey) return -1;
        if (a.sortKey > b.sortKey) return 1;
        return 0;
      });
      return sorted;
    },
    enabled: options?.enabled ?? true,
    staleTime: options?.staleTime ?? Infinity,
  });
}
