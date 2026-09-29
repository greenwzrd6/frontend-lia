import { useMutation, useQueryClient } from "@tanstack/react-query";

import { renameBoard } from "../services/boardApi";
import { boardKeys } from "../utils/queryKeys";

export function useRenameBoard(boardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, newTitle }: { id: string; newTitle: string }) =>
      renameBoard(id, newTitle),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: boardKeys.byId(boardId),
      });
    },
  });
}
