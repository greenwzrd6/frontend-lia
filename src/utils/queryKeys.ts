export const placementKeys = {
  all: ["placements"] as const,

  byBoard: (boardId: string, entityIds: string[]) =>
    ["placements", boardId, ...entityIds] as const,

  byColumnId: (columnId: string) => ["placements", "column", columnId] as const,
};

export const boardKeys = {
  all: ["board"] as const,

  byId: (boardId: string | undefined) => ["board", boardId] as const,
};

export const columnKeys = {
  all: ["columns"] as const,

  byBoardId: (boardId: string | undefined) => ["columns", boardId] as const,
};

export const entityKeys = {
  all: ["entities"] as const,

  byProjectId: (projectId: string) => ["entities", projectId] as const
}

export const columnEdgeKeys = {
  all: ["columnEdges"] as const,

  byBoardId: (boardId: string | undefined) => ["columnEdges", boardId] as const
}