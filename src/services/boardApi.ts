import { apiRequest } from "./api";
import type { BoardType } from "../types/board";

/**
 * Fetches a single board by its id (GET /api/boards/{id}).
 *
 * @param id The board's unique identifier.
 */
export async function getBoard(id: string): Promise<BoardType> {
  return apiRequest<BoardType>(`/api/boards/${id}`);
}

/**
 * Creates a new board with the given title and returns its id
 * (POST /api/boards/create?title=...).
 */
export async function createBoard(title: string): Promise<{ id: string }> {
  const params = new URLSearchParams({
    title,
  });

  return apiRequest<{ id: string }>(`/api/boards/create?${params.toString()}`, {
    method: "POST",
  });
}

/**
 * Renames a board (PUT /api/boards/rename) with a JSON body of
 * `{ id, newTitle }`. Resolves to the backend's boolean success flag.
 */
export async function renameBoard(
  id: string,
  newTitle: string,
): Promise<boolean> {
  return apiRequest<boolean>("/api/boards/rename", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id,
      newTitle,
    }),
  });
}

/** Deletes a board by id (DELETE /api/boards/delete/{id}). Resolves to the backend's boolean success flag. */
export async function deleteBoard(id: string): Promise<boolean> {
  return apiRequest<boolean>(`/api/boards/delete/${id}`, {
    method: "DELETE",
  });
}
