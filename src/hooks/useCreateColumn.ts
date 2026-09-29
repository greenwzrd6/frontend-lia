import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createColumn } from "../services/columnApi";
import { columnKeys } from "../utils/queryKeys";

export function useCreateColumn(boardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createColumn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: columnKeys.byBoardId(boardId),
      });
    },
  });
}
