import { apiRequest } from "./api";
import type { ColumnType } from "../types/column";

export type CreateColumnRequest = {
  title: string;
  position: number;
  boardId: string;
};

export type RenameColumnRequest = {
  id: string;
  newTitle: string;
};

export async function getColumnsByBoardId(
  boardId: string,
): Promise<ColumnType[]> {
  return apiRequest<ColumnType[]>(`/api/columns/boardid/${boardId}`);
}

export async function getColumn(id: string): Promise<ColumnType> {
  return apiRequest<ColumnType>(`/api/columns/${id}`);
}

export async function createColumn(
  request: CreateColumnRequest,
): Promise<void> {
  await apiRequest<void>("/api/columns/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });
}

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

export async function deleteColumn(id: string): Promise<boolean> {
  return apiRequest<boolean>(`/api/columns/delete/${id}`, {
    method: "DELETE",
  });
}
