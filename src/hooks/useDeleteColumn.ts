import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteColumn } from "../services/columnApi";
import { columnKeys } from "../utils/queryKeys";

export function useDeleteColumn(boardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteColumn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: columnKeys.byBoardId(boardId),
      });
    },
  });
}
