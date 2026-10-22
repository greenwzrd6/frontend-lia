import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createColumn } from "../services/columnApi";
import { columnKeys } from "../utils/queryKeys";
import type { ColumnType } from "../types/column";

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