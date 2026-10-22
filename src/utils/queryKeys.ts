/** Query keys for placement caches: `all`, `byBoard(boardId, entityIds)` for the board-wide bootstrap, and `byColumnId(columnId)` for a single column. */
export const placementKeys = {
  all: ["placements"] as const,

  byBoard: (boardId: string, entityIds: string[]) =>
    ["placements", boardId, ...entityIds] as const,

  byColumnId: (columnId: string) => ["placements", "column", columnId] as const,
};

/** Query keys for board caches: `all` and `byId(boardId)` (undefined id included while unknown). */
export const boardKeys = {
  all: ["board"] as const,

  byId: (boardId: string | undefined) => ["board", boardId] as const,
};

/** Query keys for column lists: `all` and `byBoardId(boardId)` (undefined id included while unknown). */
export const columnKeys = {
  all: ["columns"] as const,

  byBoardId: (boardId: string | undefined) => ["columns", boardId] as const,
};

/** Query keys for task/entity lists fetched from the TOJ API: `all` and `byProjectId(projectId)`. */
export const entityKeys = {
  all: ["entities"] as const,

  byProjectId: (projectId: string) => ["entities", projectId] as const
}

/** Query keys for column-edge lists: `all` and `byBoardId(boardId)` (undefined id included while unknown). */
export const columnEdgeKeys = {
  all: ["columnEdges"] as const,

  byBoardId: (boardId: string | undefined) => ["columnEdges", boardId] as const
}