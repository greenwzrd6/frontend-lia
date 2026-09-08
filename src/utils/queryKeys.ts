export const placementKeys = {
  all: ["placements"] as const,
  byColumnId: (columnId: string) => [...placementKeys.all, columnId],
};
