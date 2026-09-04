import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPlacement } from "../services/placementApi";

export function useCreatePlacement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPlacement,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["placements"],
      });
    },
  });
}