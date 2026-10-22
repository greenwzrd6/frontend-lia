import type { ColumnEdgeType } from "../types/columnEdge";
import { apiRequest } from "./api";

/** Payload identifying a directed edge between two columns. */
export type CreateColumnEdgeRequest = {
  fromColumnId: string;
  toColumnId: string;
};

/** Payload identifying the edge to delete by its from/to column ids. */
export type DeleteColumnEdgeRequest = {
  fromColumnId: string;
  toColumnId: string;
};

/** Creates a directed edge between two columns (POST /api/columnedges/create). */
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

/** Fetches all column edges for a board (GET /api/columnedges/boardid/{boardId}). */
export async function getColumnEdgesByBoardId(
  boardId: string,
): Promise<ColumnEdgeType[]> {
  return apiRequest<ColumnEdgeType[]>(`/api/columnedges/boardid/${boardId}`);
}

/** Deletes the edge identified by the request (DELETE /api/columnedges/delete). */
export async function deleteColumnEdge(
  request: DeleteColumnEdgeRequest,
): Promise<void> {
  await apiRequest<void>("/api/columnedges/delete", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });
}
