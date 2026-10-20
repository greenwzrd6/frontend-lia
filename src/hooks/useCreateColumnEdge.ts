import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createColumnEdge } from "../services/columnEdgeApi";
import { columnEdgeKeys } from "../utils/queryKeys";
import type { ColumnEdgeType } from "../types/columnEdge";

export function useCreateColumnEdge(boardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createColumnEdge,
    onSuccess: (_, variables) => {
      const newEdge: ColumnEdgeType = {
        fromColumnId: variables.fromColumnId,
        toColumnId: variables.toColumnId,
      };

      queryClient.setQueryData<ColumnEdgeType[]>(
        columnEdgeKeys.byBoardId(boardId),
        (oldEdges) => {
          if (!oldEdges) return [newEdge];
          const exists = oldEdges.some(
            (edge) =>
              (edge.fromColumnId === variables.fromColumnId &&
                edge.toColumnId === variables.toColumnId) ||
              (edge.fromColumnId === variables.toColumnId &&
                edge.toColumnId === variables.fromColumnId),
          );
          if (exists) return oldEdges;
          return [...oldEdges, newEdge];
        },
      );
    },
  });
}
