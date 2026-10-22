import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteColumn } from "../services/columnApi";
import { columnKeys, columnEdgeKeys } from "../utils/queryKeys";
import type { ColumnType } from "../types/column";
import type { ColumnEdgeType } from "../types/columnEdge";

/**
 * Mutation that deletes a column (DELETE /api/columns/delete/{id}).
 *
 * Optimistically removes the column from {@link columnKeys.byBoardId} and any
 * edge touching it from {@link columnEdgeKeys.byBoardId}; both caches are
 * restored from snapshots if the request fails.
 */
export function useDeleteColumn(boardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteColumn,

    onMutate: (id: string) => {
      const columnKey = columnKeys.byBoardId(boardId);
      const edgeKey = columnEdgeKeys.byBoardId(boardId);

      const snapshotColumns = queryClient.getQueryData<ColumnType[]>(columnKey);
      const snapshotEdges = queryClient.getQueryData<ColumnEdgeType[]>(edgeKey);

      queryClient.setQueryData<ColumnType[]>(columnKey, (old) =>
        old?.filter((column) => column.id !== id),
      );
      queryClient.setQueryData<ColumnEdgeType[]>(edgeKey, (old) =>
        old?.filter(
          (edge) => edge.fromColumnId !== id && edge.toColumnId !== id,
        ),
      );

      return { columnKey, edgeKey, snapshotColumns, snapshotEdges };
    },

    onError: (_error, _id, context) => {
      if (!context) return;
      if (context.snapshotColumns) {
        queryClient.setQueryData(context.columnKey, context.snapshotColumns);
      }
      if (context.snapshotEdges) {
        queryClient.setQueryData(context.edgeKey, context.snapshotEdges);
      }
    },
  });
}