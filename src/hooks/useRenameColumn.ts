import { useMutation, useQueryClient } from "@tanstack/react-query";

import { renameColumn } from "../services/columnApi";
import { columnKeys } from "../utils/queryKeys";
import type { ColumnType } from "../types/column";

type RenameVariables = {
  id: string;
  newTitle: string;
  boardId: string;
};

export function useRenameColumn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, newTitle }: RenameVariables) =>
      renameColumn({ id, newTitle }),

    onMutate: ({ id, newTitle, boardId }) => {
      const key = columnKeys.byBoardId(boardId);
      const snapshot = queryClient.getQueryData<ColumnType[]>(key);

      queryClient.setQueryData<ColumnType[]>(key, (old) =>
        old?.map((column) =>
          column.id === id ? { ...column, title: newTitle } : column,
        ),
      );

      return { key, snapshot };
    },

    onError: (_error, _variables, context) => {
      if (context?.snapshot) {
        queryClient.setQueryData(context.key, context.snapshot);
      }
    },
  });
}