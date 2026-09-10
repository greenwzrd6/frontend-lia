export const placementKeys = {
  all: ["placements"] as const,

  byBoard: (boardId: string, entityIds: string[]) =>
    ["placements", boardId, ...entityIds] as const,

  byColumnId: (columnId: string) =>
    ["placements", "column", columnId] as const,
};