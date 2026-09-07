import { useMutation } from "@tanstack/react-query";
import { createPlacement } from "../services/placementApi";

export function useCreatePlacement() {
  return useMutation({
    mutationFn: createPlacement,
  });
}
