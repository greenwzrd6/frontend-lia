import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createColumn } from "../services/columnApi";
import { columnKeys } from "../utils/queryKeys";
import type { ColumnType } from "../types/column";

/**
 * Mutation that creates a column (POST /api/columns/create).
 *
 * On success it appends the new column to the cached list under
 * {@link columnKeys.byBoardId} instead of invalidating it, so the board
 * re-renders with the column immediately.
 */
export function useCreateColumn(boardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createColumn,
    onSuccess: (created, variables) => {
      queryClient.setQueryData<ColumnType[]>(
        columnKeys.byBoardId(boardId),
        (old) => {
          if (!old) return old;
          return [
            ...old,
            {
              id: created.id,
              boardId: variables.boardId,
              title: variables.title,
              position: variables.position,
              requestWritable: true,
            },
          ];
        },
      );
    },
  });
}