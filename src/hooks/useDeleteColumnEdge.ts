import { useMutation } from "@tanstack/react-query";

import { deleteColumnEdge } from "../services/columnEdgeApi";

export function useDeleteColumnEdge() {
  return useMutation({
    mutationFn: deleteColumnEdge,
  });
}
