import { apiRequest } from "./api";
import type { PlacementType } from "../types/placement";
import type { ColumnId } from "../types/column";
import type { BoardId } from "../types/board";

export type CreatePlacementRequest = {
  entityId: string;
  boardId: string;
  columnId: string;
  afterEntityId: string | null;
  beforeEntityId: string | null;
};

export async function getPlacements(
  boardId: BoardId,
): Promise<PlacementType[]> {
  try {
    return await apiRequest<PlacementType[]>(
      `/api/placements/board/${boardId.id}`,
    );
  } catch (error) {
    console.log(
      `Something went wrong while getting placements by BoardId: ${boardId.id}`,
    );
    console.log(`Error: ${error}`);
    return [];
  }
}

export async function getPlacementsByColumn(
  columnId: ColumnId,
): Promise<PlacementType[]> {
  try {
    return await apiRequest<PlacementType[]>(
      `/api/placements/column/${columnId.id}`,
    );
  } catch (error) {
    console.log(
      `Something went wrong while getting placements in the column: ${columnId.id}`,
    );
    console.log(`Error: ${error}`);
    return [];
  }
}

export async function createPlacement(
  request: CreatePlacementRequest,
): Promise<void> {
  console.log(request)
  await apiRequest<void>("/api/placements/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });
}
