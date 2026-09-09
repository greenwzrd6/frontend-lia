import { apiRequest } from "./api";
import type { PlacementType } from "../types/placement";
import type { EntityType } from "../types/entity";

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
  console.log(request);
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
) {
  const placedEntityIds = new Set(
    placements.map((placement) => placement.entityId),
  );

  const missingEntityIds = entities
    .filter((entity) => !placedEntityIds.has(entity.id))
    .map((entity) => entity.id);

  console.log(
    "ENTITIES:",
    entities.map((entity) => entity.id),
  );
  console.log("EXISTING PLACEMENTS:", [...placedEntityIds]);
  console.log("MISSING ENTITY IDS:", missingEntityIds);

  if (missingEntityIds.length === 0) {
    return;
  }

  await createPlacement({
    entityIds: missingEntityIds,
    boardId,
    columnId: "22222222-2222-2222-2222-222222222220",
    afterEntityId: null,
    beforeEntityId: null,
    sourceColumnId: null,
  });
}
