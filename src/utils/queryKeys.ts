import type { ColumnId } from "../types/column";

export const placementKeys = {
    all: ["placements"] as const,
    byColumnId: (columnId: ColumnId) => [...placementKeys.all, columnId]
}