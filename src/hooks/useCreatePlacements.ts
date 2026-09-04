import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPlacement, getPlacement } from "../services/placementApi";
import type { PlacementType } from "../types/placement";

export function useCreatePlacement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPlacement,

    onSuccess: async (_, variables) => {
      const updatedPlacements = await getPlacement(
        [variables.entityId],
        variables.boardId,
      );

      queryClient.setQueryData<PlacementType[]>(
        ["placements", variables.boardId],
        (oldPlacements = []) => {
          const updatedIds = new Set(
            updatedPlacements.map((placement) => placement.entityId),
          );

          const existing = oldPlacements.filter(
            (placement) => !updatedIds.has(placement.entityId),
          );

          return [...existing, ...updatedPlacements];
        },
      );
    },
  });
}
