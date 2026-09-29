import { useMutation, useQueryClient } from "@tanstack/react-query";

import { renameColumn } from "../services/columnApi";
import { columnKeys } from "../utils/queryKeys";

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
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: columnKeys.byBoardId(variables.boardId),
      });
    },
  });
}
