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
  const params = new URLSearchParams();

  params.set("boardId", boardId);

  try {
    console.log("gotted placement");
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

export async function getPlacement(
  entityId: string,
  boardId: string,
): Promise<PlacementType | null> {
  const params = new URLSearchParams();

  params.set("entityId", entityId);
  params.set("boardId", boardId);

  try {
    return await apiRequest<PlacementType>(
      `/api/placements/get?${params.toString()}`,
    );
  } catch (error) {
    console.log(
      `Something went wrong while getting placement with entityId: ${entityId}`,
    );
    console.log(`Error: ${error}`);
    return null;
  }
}

export async function createPlacement(
  request: CreatePlacementRequest,
): Promise<void> {
  await apiRequest<void>("/api/placements/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });
}
