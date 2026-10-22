import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteColumnEdge } from "../services/columnEdgeApi";
import { columnEdgeKeys } from "../utils/queryKeys";
import type { ColumnEdgeType } from "../types/columnEdge";

/**
 * Mutation that deletes a column edge (DELETE /api/columnedges/delete).
 *
 * On success it filters the matching edge — in either direction — out of the
 * cache under {@link columnEdgeKeys.byBoardId}.
 */
export function useDeleteColumnEdge(boardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteColumnEdge,
    onSuccess: (_, variables) => {
      queryClient.setQueryData<ColumnEdgeType[]>(
        columnEdgeKeys.byBoardId(boardId),
        (oldEdges) => {
          if (!oldEdges) return [];
          return oldEdges.filter(
              (edge) =>
                (edge.fromColumnId !== variables.fromColumnId ||
                  edge.toColumnId !== variables.toColumnId) &&
                (edge.fromColumnId !== variables.toColumnId ||
                  edge.toColumnId !== variables.fromColumnId),
            );
        },
      );
    },
  });
}
