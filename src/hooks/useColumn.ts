import { useQuery } from "@tanstack/react-query";
import type { ColumnType } from "../types/column";
import { getPlacementsByColumn } from "../services/placementApi";
import { placementKeys } from "../utils/queryKeys";
import type { EntityType } from "../types/entity";
interface QueryOptions {
  enabled?: boolean;
  staleTime?: number;
}
export function useColumn(
  column: ColumnType,
  boardId: string,
  entities: EntityType[],
  options?: QueryOptions,
) {
  return useQuery({
    queryKey: placementKeys.byColumnId(column.id),
    queryFn: async () => {
      const result = await getPlacementsByColumn(column.id, boardId);
      const filtered = result.filter((placement) =>
        entities.some((entity) => entity.Id === placement.entityId),
      );
      return [...filtered].sort((a, b) => {
        if (a.sortKey < b.sortKey) return -1;
        if (a.sortKey > b.sortKey) return 1;
        return 0;
      });
    },
    enabled: options?.enabled ?? true,
    staleTime: options?.staleTime ?? Infinity,
  });
}
