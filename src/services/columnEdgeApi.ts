import type { ColumnEdgeType } from "../types/columnEdge";
import { apiRequest } from "./api";

export type CreateColumnEdgeRequest = {
  fromColumnId: string;
  toColumnId: string;
};

export async function createColumnEdge(
  request: CreateColumnEdgeRequest,
): Promise<void> {
  await apiRequest<void>("/api/columnedges/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });
}

export async function getColumnEdgesByBoardId(
  boardId: string,
): Promise<ColumnEdgeType[]> {
  return apiRequest<ColumnEdgeType[]>(`/api/columnedges/boardid/${boardId}`);
}
