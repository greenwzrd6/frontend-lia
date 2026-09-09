import { apiRequest } from "./api";
import type { PlacementType } from "../types/placement";
import type { EntityType } from "../types/entity";
import Column from "../components/Column/Column";
import type { ColumnType } from "../types/column";

export type CreatePlacementRequest = {
  entityIds: string[];
  boardId: string;
  columnId: string;
  afterEntityId: string | null;
  beforeEntityId: string | null;
  sourceColumnId: string | null;
};

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
    console.log(`Error: ${error}`);

    return [];
  }
}

export async function getPlacementsByColumn(
  columnId: string,
  boardId: string,
): Promise<PlacementType[]> {
  try {
    return await apiRequest<PlacementType[]>(
      `/api/placements/column/${columnId}?boardId=${boardId}`,
    );
  } catch (error) {
    console.log(
      `Something went wrong while getting placements in the column: ${columnId}`,
    );
    console.log(`Error: ${error}`);
    return [];
  }
}

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

export async function createMissingPlacements(
  entities: EntityType[],
  placements: PlacementType[],
  boardId: string,
  columns: ColumnType[]
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

  let afterEntityId: string | null = null;

  const inboxColumn = columns.find(
    (column) => column.position === 0
  );

    if (!inboxColumn) {
    return;
  }

  for (const entityId of missingEntityIds) {
    await createPlacement({
      entityIds: [entityId],
      boardId,
      columnId: inboxColumn.id,
      afterEntityId,
      beforeEntityId: null,
      sourceColumnId: null,
    });

    afterEntityId = entityId;
  }
}
