import { useMutation } from "@tanstack/react-query";

import { createColumnEdge } from "../services/columnEdgeApi";

export function useCreateColumnEdge() {
  return useMutation({
    mutationFn: createColumnEdge,
  });
}
