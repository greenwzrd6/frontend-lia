import { apiRequest } from "./api";
import type { PlacementType } from "../types/placement";
import type { TaskType } from "../types/task";
import type { ColumnType } from "../types/column";

/** Payload for creating placements that position entities within a column. */
export type CreatePlacementRequest = {
  entityIds: string[];
  boardId: string;
  columnId: string;
  /** Existing entity ids the new entities should be placed after. */
  afterEntityIds: string[];
  /** Existing entity ids the new entities should be placed before. */
  beforeEntityIds: string[];
  /** Column the entities moved from, or null when placed for the first time. */
  sourceColumnId: string | null;
};

/**
 * Fetches placements for the given entities on a board
 * (GET /api/placements/get?EntityIds=...&boardId=...).
 *
 * Returns an empty array instead of throwing if the request fails.
 */
export async function getPlacements(
  entityIds: string[],
  boardId: string,
): Promise<PlacementType[]> {
  const params = new URLSearchParams();

  for (const entityId of entityIds) {
    params.append("EntityIds", entityId);
  }

  params.set("boardId", boardId);

  try {
    return await apiRequest<PlacementType[]>(
      `/api/placements/get?${params.toString()}`,
    );
  } catch (error) {
    console.log(
      `Something went wrong while getting placements by BoardId: ${boardId}`,
    );
    console.log("Error:", error);

    return [];
  }
}

/**
 * Fetches the placements currently in a column on a board
 * (GET /api/placements/column/{columnId}?boardId=...).
 *
 * Returns an empty array instead of throwing if the request fails.
 */
export async function getPlacementsByColumn(
  columnId: string,
  boardId: string,
): Promise<PlacementType[]> {
  try {
    const placements = await apiRequest<PlacementType[] | undefined>(
      `/api/placements/column/${columnId}?boardId=${boardId}`,
    );

    return placements ?? [];
  } catch (error) {
    console.log(
      `Something went wrong while getting placements in the column: ${columnId}`,
    );
    console.log("Error:", error);
    return [];
  }
}

/**
 * Creates placements for the given entities (POST /api/placements/create),
 * inserting them relative to the before/after neighbours in the request.
 */
export async function createPlacement(
  request: CreatePlacementRequest,
): Promise<void> {
  console.log("CREATE PLACEMENT REQUEST:", request);
  await apiRequest<void>("/api/placements/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });
}

/**
 * Places any of `entities` that have no placement yet into the board's inbox
 * column (the column at position 0) via {@link createPlacement}.
 *
 * Does nothing when every entity is already placed or when the board has no
 * inbox column.
 */
export async function createMissingPlacements(
  entities: TaskType[],
  placements: PlacementType[],
  boardId: string,
  columns: ColumnType[],
) {
  const placedEntityIds = new Set(
    placements.map((placement) => placement.entityId),
  );

  const missingEntityIds = entities
    .filter((entity) => !placedEntityIds.has(entity.id))
    .map((entity) => entity.id);

  if (missingEntityIds.length === 0) {
    return;
  }

  const afterEntityIds: string[] = [];

  const inboxColumn = columns.find((column) => column.position === 0);

  if (!inboxColumn) {
    return;
  }
  await createPlacement({
    entityIds: missingEntityIds,
    boardId,
    columnId: inboxColumn.id,
    afterEntityIds,
    beforeEntityIds: [],
    sourceColumnId: null,
  });
}
