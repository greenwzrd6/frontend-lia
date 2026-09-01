import { apiRequest } from "./api";
import type { Board } from "../types/board";

export async function getBoard(id: string): Promise<Board> {
  return apiRequest<Board>(`/api/boards/${id}`);
}

export async function createBoard(title: string): Promise<{ id: string }> {
  const params = new URLSearchParams({
    title,
  });

  return apiRequest<{ id: string }>(`/api/boards/create?${params.toString()}`, {
    method: "POST",
  });
}

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

export async function deleteBoard(id: string): Promise<boolean> {
  return apiRequest<boolean>(`/api/boards/delete/${id}`, {
    method: "DELETE",
  });
}
