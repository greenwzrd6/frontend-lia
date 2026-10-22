import { useMutation, useQueryClient } from "@tanstack/react-query";

import { renameBoard } from "../services/boardApi";
import { boardKeys } from "../utils/queryKeys";
import type { BoardType } from "../types/board";

export function useRenameBoard(boardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, newTitle }: { id: string; newTitle: string }) =>
      renameBoard(id, newTitle),

    onMutate: ({ newTitle }) => {
      const key = boardKeys.byId(boardId);
      const snapshot = queryClient.getQueryData<BoardType>(key);

      queryClient.setQueryData<BoardType>(key, (old) =>
        old ? { ...old, title: newTitle } : old,
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