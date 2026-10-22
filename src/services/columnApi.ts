import { apiRequest } from "./api";
import type { ColumnType } from "../types/column";

/** Payload for creating a column: its title, board-relative position, and owning board. */
export type CreateColumnRequest = {
  title: string;
  position: number;
  boardId: string;
};

/** Response from createColumn: the id of the newly created column. */
export type CreateColumnResponse = {
  id: string;
};

/** Payload for renaming a column: the column id and its new title. */
export type RenameColumnRequest = {
  id: string;
  newTitle: string;
};


/**
 * Fetches all columns belonging to a board (GET /api/columns/boardid/{boardId}).
 */
export async function getColumnsByBoardId(
  boardId: string,
): Promise<ColumnType[]> {
  return apiRequest<ColumnType[]>(`/api/columns/boardid/${boardId}`);
}

/** Fetches a single column by id (GET /api/columns/{id}). */
export async function getColumn(id: string): Promise<ColumnType> {
  return apiRequest<ColumnType>(`/api/columns/${id}`);
}

/**
 * Creates a column from a {@link CreateColumnRequest} (POST /api/columns/create)
 * and returns its new id.
 */
export async function createColumn(
  request: CreateColumnRequest,
): Promise<CreateColumnResponse> {
  return apiRequest<CreateColumnResponse>("/api/columns/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });
}

/**
 * Renames a column (PUT /api/columns/rename) with a JSON body of
 * `{ id, newTitle }`. Resolves to the backend's boolean success flag.
 */
export async function renameColumn(
  request: RenameColumnRequest,
): Promise<boolean> {
  return apiRequest<boolean>("/api/columns/rename", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: request.id,
      newTitle: request.newTitle,
    }),
  });
}

/** Deletes a column by id (DELETE /api/columns/delete/{id}). Resolves to the backend's boolean success flag. */
export async function deleteColumn(id: string): Promise<boolean> {
  return apiRequest<boolean>(`/api/columns/delete/${id}`, {
    method: "DELETE",
  });
}
