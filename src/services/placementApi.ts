import { apiRequest } from "./api";
import type { PlacementType } from "../types/placement";

export type CreatePlacementRequest = {
  entityId: string;
  boardId: string;
  columnId: string;
  afterEntityId: string | null;
  beforeEntityId: string | null;
};

export async function getPlacements(boardId: string): Promise<PlacementType[]> {
  try {
    return await apiRequest<PlacementType[]>(
      `/api/placements/board/${boardId}`,
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
