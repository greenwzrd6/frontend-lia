import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPlacement, type CreatePlacementRequest } from "../services/placementApi";

export function useCreatePlacement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreatePlacementRequest) =>
      createPlacement(request),

    onSuccess: (_, request) => {
      queryClient.invalidateQueries({
        queryKey: ["placement", request.columnId],
      });
    },
  });
}